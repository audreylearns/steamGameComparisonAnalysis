#ingestion ?
import pandas as pd
import utils.fetch as fetch



# display all columns
pd.set_option('display.max_columns', None) 

# 1 obj, sereis
# res = fetch.get_game_details('774171')
# gamedf = pd.DataFrame(res["price_overview"])
# gamedf.head()

# retrieve data, must be from control
# data = fetch.get_rev('774171', 300)

# handle nested dictionary author
# rtn row q author.column
# df = pd.json_normalize(data,max_level=1)

# ----------LOCALIZATION FOR EXPLORATION----------
# OPT1: convert pandas to csv, no indexes 
# df.to_csv('out.csv', index=False) 
# READ csv to panda
# pd.read_csv('out.csv')  


# OPT 2: convert panda to paqruet
# df.to_parquet('sample.parquet')
# READ parquet to panda
df_raw = pd.read_parquet('sample.parquet') 
df = df_raw.copy()

# drop tables
df.drop(columns=['timestamp_created', 'timestamp_updated','language', 'recommendationid', 'hidden_in_steam_china', 'steam_china_location','author.steamid'],axis=1, inplace=True)


# Tests:
#17, 2, 37(special chars), 41, 74, 298, 124(jap chars), 278 (link, tags)


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

# FILTER: create new columns for vote results
df['total'] = df['votes_up'] + df['votes_funny']
df['score'] = (df['votes_up'] + 1) / (df['total'] + 1)

# Goal, filter all reviews less than 0.50
df_filtered= df.loc[(df['score'] >= .5)]

# Fn format:
# Call after fetch completed, input the returned object)
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


#Fn format: 
# returns a dataframe of steam reviews scoring minimum 50% from based on votes
# new columns added to dataframe: total & score
def filterby_score(df):
    # FILTER: create new columns for vote results
    df['total'] = df['votes_up'] + df['votes_funny']
    df['score'] = (df['votes_up'] + 1) / (df['total'] + 1)
    # Goal, filter all reviews less than 0.50
    df_filtered= df.loc[(df['score'] >= .5)]
    return df_filtered

# ----------ADD ONS----------
# FILTER; drop down | Radio button: specify hours played at review [<10, <30, >30]

# Display: Top highly scored comment (applying the filter above?)

# Display: Median scored comment (applying the filter above?)

# Display: Lowest scored comment (applying the filter above?)


# ----------MODEL----------
# Roberta Pretrained Model
# likely move to a diff script
from transformers import AutoTokenizer,  AutoConfig
from transformers import AutoModelForSequenceClassification
from scipy.special import softmax

# MODEL = f"cardiffnlp/twitter-roberta-base-sentiment-latest"
# tokenizer = AutoTokenizer.from_pretrained(MODEL)
# model = AutoModelForSequenceClassification.from_pretrained(MODEL)


MODEL = f"cardiffnlp/twitter-roberta-base-sentiment-latest"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
config = AutoConfig.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)


# return the compound score for string input if score is True
# categorical: -1 (neg), 0 (neu), 1(pos)
# else returns the polarity scores dictionary for string input
# simplicitY: pick highest score among the the three
# caveat: if evenly scored pos & neg == neutral
def polarity_scores(string, score=True):
    # encoded_text = tokenizer(string, max_length=128, truncation=True, padding='max_length', return_tensors='pt')
    encoded_text = tokenizer(string, return_tensors='pt')
    num_tokens = len(encoded_text)
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
# test run
# polarity_scores(df_filtered['review'].iloc[0])
# df_filtered['review'].iloc[1]

# Goal: Adds sentiment score column to dataframe
# Input: a dataframe column to run analysis
def sentiment_score(dataframe):
    # max token of 512
    dataframe['sentiment'] = dataframe['review'].apply(polarity_scores)
    # text too large
    return dataframe    
# print(sentiment_score(df_filtered))


# length of max str length, words (only 512 tokens)
#new column to store string, filter out max length to be handled
df['rev_len'] = df['review'].str.len()


# Get max length of string in col....returns the iloc
# iloc_maxlen= df.iloc[df['rev_len'].argmax()]

# Sort vals by string length asc
df.sort_values(by=['rev_len'])

# process up to rev len of 5k...
df_500 = df.loc[(df['rev_len'] <= 5000)]


# iloc 179 for 1077, 164 for 4823, 133 for 3668, 258 for 2220, 266 for 5209
# breaks @198 len >7k....has to be less than 5k? max 5k
# get iloc of idx where length of col is __
# sample loc curr @ 285 rows
def getiloc(len):
    index_location = df_500.loc[df_500['rev_len'] == 4823].index[0]
    iloc_location = df_500.index.get_loc(index_location)
    return iloc_location

print("test")