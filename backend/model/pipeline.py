#ingestion ?
import pandas as pd
# import fetch as fetch
from transformers import AutoTokenizer,  AutoConfig
from transformers import AutoModelForSequenceClassification
from scipy.special import softmax


# display all columns
pd.set_option('display.max_columns', None) 

# retrieve data, must be from control
# data = fetch.get_rev('774171', 300)

# handle nested dictionary author
# rtn row q author.column
# df = pd.json_normalize(data,max_level=1)

# ----------LOCALIZATION FOR EXPLORATION----------
# convert panda to paqruet
# df.to_parquet('sample.parquet')
# READ parquet to panda
# df_raw = pd.read_parquet('sample.parquet') 
# df = df_raw.copy()



# data: json object from an API call
# returns a dataframe of steam reviews, with added columns: score &
def remove_noise(data):
    df = pd.json_normalize(data,max_level=1)
    df.drop(columns=['timestamp_created', 'timestamp_updated','language', 'recommendationid', 'hidden_in_steam_china', 'steam_china_location','author.steamid'],axis=1, inplace=True)
    
    # rm tags, [any]
    df['review'] = df['review'].replace('\[.*?\]', '', regex=True)
    # rm all non-ASCII values:
    df['review'] = df['review'].replace('[^\x00-\x7F]', '', regex=True)
    # rm raw escape chars
    df['review'] = df['review'].replace('[\\n\\t]', ' ', regex=True)
    # Negative look behind: rm all / unless its num/num
    df['review'] = df['review'].replace("(?<!\d)\/", '', regex=True)
    # look behind, replace duplicates
    df['review'] = df['review'].replace("(?<=[/,'!])[/,'!]", '', regex=True)
    #  remove any links embedded
    df['review'] = df['review'].replace("http\S*",' ', regex=True)
    # only 1 space allowed
    df['review'] = df['review'].replace("\s{2,}", ' ', regex=True)
    # leave only alpha, num, punc, space 
    df['review'] = df['review'].replace("[^0-9a-zA-Z.',!\s/]+",'', regex=True)


    # rm rows if it doesnt have minimum 2 alphabet characters
    df = df[df['review'].str.count(r'[a-zA-Z]') >= 2]
    return df


# returns a dataframe of steam reviews scoring minimum 50% from based on votes
# new columns added to dataframe: total & score
def filterby_score(df):
    # FILTER: create new columns for vote results
    df['total'] = df['votes_up'] + df['votes_funny']
    df['score'] = (df['votes_up'] + 1) / (df['total'] + 1)
    # Goal, filter all reviews less than 0.50
    df_filtered= df.loc[(df['score'] >= .5)].copy()
    return df_filtered



# ----------MODEL----------
# Roberta Pretrained Model from huggingface
MODEL = f"cardiffnlp/twitter-roberta-base-sentiment-latest"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
config = AutoConfig.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)


# if score is True, returns the compound score for string input 
# categorical: -1 (neg), 0 (neu), 1(pos)
# if score is False, returns the polarity scores dictionary for string input
def polarity_scores(string, score=True):
    # encoded_text = tokenizer(string, max_length=128, truncation=True, padding='max_length', return_tensors='pt')
    encoded_text = tokenizer(string, return_tensors='pt')
    output = model(**encoded_text)
    scores = output[0][0].detach().numpy()
    scores = softmax(scores)
    scores_dict = {
        'neg' : scores[0],
        'neu' : scores[1],
        'pos' : scores[2]
    }
    if (score):
        if (scores_dict['neg'] == scores_dict['pos']):
            return 0
        else:
            sentiment = max(scores_dict , key= lambda x: scores_dict [x])
            match sentiment:
                case 'neg':
                    return -1
                case 'neu':
                    return 0
                case 'pos':
                    return 1
    else:
        return scores_dict


# Returns a dataframe with 2 columns: a) top reviews for sentiment category  b)detailed polarity score for the review
# Ct, number of reviews to provide detailed scoring
# sentiment, sentiment category: 'neg', 'neu', 'pos'
def review_sample(dataframe, sentiment, ct=3,):
    match sentiment:
        case 'neg':
            sentiment = dataframe.loc[(dataframe["sentiment"] == -1)].copy()
        case 'neu':
            sentiment = dataframe.loc[(dataframe["sentiment"] == 0)].copy()
        case 'pos':
            sentiment = dataframe.loc[(dataframe["sentiment"] == 1)].copy()

    sentiment = sentiment.sort_values(by=['score'],ascending=False) 
    sentiment = sentiment.head(ct).copy()
    sentiment['detailed_score'] = sentiment['review'].apply(polarity_scores, score=False)
   
    rtn = pd.json_normalize(sentiment['detailed_score']) 
    rtn = rtn.map(lambda x: round(x * 100)) 
    rev = sentiment['review'].reset_index(drop=True)
    rtn  = rtn .reset_index(drop=True)
    rtn  = pd.concat([rtn , rev], axis=1)

    return rtn.to_dict(orient='records')

# Adds sentiment score column to dataframe
# Input: a dataframe column to run analysis
def sentiment_score(dataframe):
    # model token max at 512
    dataframe['rev_len'] = dataframe['review'].str.len()
    # process reviews up to 2300 characters
    dataframe = dataframe.loc[(dataframe['rev_len'] <= 1000)].copy()
    dataframe['sentiment'] = dataframe['review'].apply(polarity_scores)

    return dataframe    
# print(sentiment_score(df_filtered))


# returns a dictionary of the review dataframe polarity percentage
# 1: positive, 0: neutral, -1: negative
def polarity_percentage(df):
    total_processed = len(df.index)
    result = df['sentiment'].value_counts().to_dict()
    for score in result:
        result[score] = round((result[score]/total_processed) * 100)
    return result


# ----------Clustering----------
from collections import Counter
import nltk # text preprocesing lib
from nltk.tokenize import word_tokenize #?
from nltk.corpus import stopwords
from nltk.tag import pos_tag
from nltk.stem import WordNetLemmatizer
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download("wordnet")
nltk.download("omw-1.4")
stop_words = set(stopwords.words('english'))
wnl = WordNetLemmatizer()

# splits a string into words
def tokenize(string):
    return word_tokenize(string)

# applies transformation for clustering text: all lowercased, remove punctuations, numbers, stop words
# returns the top n list of words that are nouns, adjectives and lemmatized
def cluster_clean(df):
    df['review'] = df['review'].str.lower()
    df['review'] = df['review'].replace('[^A-Za-z\s]', '', regex=True)
    token_list = df['review'].apply(tokenize).sum()
    tagged_tokens = pos_tag(token_list)
    filtered_words = [w for w, tag in tagged_tokens if tag.startswith('NN') or tag.startswith('JJ')]
    filtered_words = [w for w in token_list if not w in stop_words]
    lem_list = []
    for w in filtered_words:
        lem_list.append(wnl.lemmatize(w))
    lem_list[:] = (value for value in lem_list if value != "game")
    return lem_list

# returns default top 7 words from review data frame
# tokens = processed dataframe from cluster_clean
def top_cluster(tokens,top=7):
    frequency = nltk.FreqDist(tokens)
    return sorted(frequency,key=frequency.__getitem__, reverse=True)[0:top]


print("test")
# ----------ADD ONS----------
# FILTER; drop down | Radio button: specify hours played at review [<10, <30, >30]

# df_2300 = df_2300.sort_values(by=['score'])
# # Display: Top highly scored comment (applying the filter above?)
# top = df_2300[(df_2300['score'] == 1) & (df_2300['total'] > 0)].head()
# polarity_scores(top['review'].iloc[0], False)
# polarity_scores(top['review'].iloc[0])
# top['review'].iloc[0]
# # Display: Median scored comment (applying the filter above?)
# median = df_2300[(df_2300['score'] >= 0.75) & (df_2300['total'] > 0)].head()
# polarity_scores(median['review'].iloc[0], False)
# polarity_scores(median['review'].iloc[0])
# median['review'].iloc[0]
# # Display: Lowest scored comment (applying the filter above?)
# lowest = df_2300[(df_2300['score'] < 0.6) & (df_2300['total'] > 0)].head()
# polarity_scores(lowest['review'].iloc[0], False)
# polarity_scores(lowest['review'].iloc[0])
# lowest['review'].iloc[0]

# Display a sample Pos comment

# Display a sample neg comment

# Display a sample Neu comment