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

# FILTER: specify hours played at review [<10, <30, >30]