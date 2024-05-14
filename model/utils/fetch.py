msg = "test"
print(msg)

import requests 
from bs4 import BeautifulSoup 

# url = "https://store.steampowered.com/appreviews/413150?json=1"
url = "https://store.steampowered.com/"

# Making a GET request 
# res = requests.get(url).json()
  
# check status code for response received 
# success code - 200 
# print(res) 
  
# print content of request 
# print(res.content)

# print content of request PRETTY 
# soup = BeautifulSoup(res.content, 'html.parser') 
# print(soup.prettify()) 

#app id = gameid, n = total num of revs to fetch
#returns list of revs, dict struct
#100 calls per day
def get_rev(appid, n=100):
    reviews = []
    cursor = '*'
    params = {
        'json' : 1,
        'filter' : 'all',
        'language' : 'english',
        'day_range' : 9223372036854775807,
        'review_type' : 'all',
        'purchase_type' : 'all'
    }

    while n > 0:
        params['cursor'] = cursor.encode()
        params['num_per_page'] = min(100, n)
        n-=100

        res = requests.get(url=url+'appreviews/'+appid, params=params).json()
        cursor = res['cursor']
        reviews += res['reviews']
        if len(res['reviews']) < 100: break
    return reviews

# should return 300 revs of muse dash
# max 100k calls per day
# rev = get_rev('774171', 300)
# print(rev[299]["author"]["playtime_at_review"])
# print(rev[0]["review"])

# https://store.steampowered.com/api/appdetails?appids=774171
def get_game_details(appid):
    details = requests.get(url=url+'api/appdetails?appids='+appid).json()
    # details = requests.get("https://store.steampowered.com/api/appdetails?appids=774171").json()
    return details[appid]["data"]
# price and deals details[appid]["data"]["price_overview"]


# game = get_game_details('774171')
# print(game["name"])
# print(game["detailed_description"])
# detailed desc has tags

def convert_currency(value, target='USD'):
    if (target != 'USD'):
        conv_rate = requests.get("https://open.er-api.com/v6/latest/USD").json()
        conv_rate = conv_rate["rates"][target]
        return round(value * float(conv_rate),2)

# offer 12 currencies: 
# AUD, AED, BRL, CAD, CHF, CNY, COP, CUP, DKK, EUR, HKD, JPY, KRW, MXN, PHP, VND, NZD
#use the rtn to create a drop down list

# print(convert_currency(2.99, 'CNY'))

#only calls to check if deals avail on steam, else empty
# def game_deals(id):
#     deal = requests.get("https://www.cheapshark.com/api/1.0/deals?storeID=1&onSale=1&steamAppID=" + id).json()
#     return deal

# print(game_deals('774171'))



# maybe change to a local.json listing all the games?
# https://stackoverflow.com/questions/57441606/how-to-get-the-steam-appid-by-appname-in-steam-webapi
# https://api.steampowered.com/ISteamApps/GetAppList/v2/


# return list, get user input to get the specific game
# imp "external" for title display + "thumb" prev img
def game_search(title):
    res = requests.get("https://www.cheapshark.com/api/1.0/games?title=" + title).json() 
    return res


#return steam appid from cheapshark gamelookup gameid, parse steam
def get_steamID(gameID):
    res = requests.get("https://www.cheapshark.com/api/1.0/games?id=" + str(gameID)).json()
    return res["info"]["steamAppID"]

# game_search('sims')
# get_game_details(get_steamID(63))