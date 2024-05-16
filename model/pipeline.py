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
df = pd.read_parquet('sample.parquet') 





