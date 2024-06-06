
import requests 

#100k calls per day
steam_url = "https://store.steampowered.com/"
cheapshark_url = "https://www.cheapshark.com/api/1.0/games?"
 

# app id = gameid, n = total num of revs to fetch
# returns list of revs, dict struct
# fetch max 100 reviews per req
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

        res = requests.get(url=steam_url+'appreviews/'+appid, params=params).json()
        cursor = res['cursor']
        reviews += res['reviews']
        if len(res['reviews']) < 100: break
    return reviews

# quick test:
# rev = get_rev('1222670', 300)
# print(rev[299]["author"]["playtime_at_review"])
# print(rev[0]["review"])


def get_game_details(appid):
    details = requests.get(url=steam_url+'api/appdetails?appids='+appid).json()
    # details = requests.get("https://store.steampowered.com/api/appdetails?appids=774171").json()
    return details[appid]["data"]
# price and deals details[appid]["data"]["price_overview"]


# game = get_game_details('774171')
# print(game["name"])
# print(game["short_description"])
# detailed desc has tags


# use the rtn to create a drop down list from keys
def convert_currency(value, target='USD'):
    if (target != 'USD'):
        conv_rate = requests.get("https://open.er-api.com/v6/latest/USD").json()
        conv_rate = conv_rate["rates"][target]
        return round(int(value) * float(conv_rate),2)
# quick test:
# print(convert_currency(2.99, 'CNY'))


# maybe change to a local.json listing all the games?
# https://stackoverflow.com/questions/57441606/how-to-get-the-steam-appid-by-appname-in-steam-webapi
# https://api.steampowered.com/ISteamApps/GetAppList/v2/


# return list, get user input to get the specific game
# imp "external" for title display + "thumb" prev img, "gameid" for to grab steamappid
# return null if game not avail on steam
def game_search(title):
    res = requests.get(url=cheapshark_url+"title=" + title).json() 
    # check if game exist in steam, ie steamAppID != null, return empty
    return res


# return steam appid from cheapshark gamelookup gameid, parse steam
# ensure game exist in steam db
def get_steamID(gameID):
    res = requests.get(url=cheapshark_url+"id=" + str(gameID)).json()
    return res["info"]["steamAppID"]

# combo call sample
# game_search('sims')
# get_game_details(get_steamID(63))

# returns a dict of review summary: total, positive, score for steamappid
def get_reviewSummary(appid): 
    summary = {}
    params = {
        'json' : 1,
        'filter' : 'all',
        'language' : 'english',
        'day_range' : 9223372036854775807,
        'review_type' : 'all',
        'purchase_type' : 'all'
    }
    res = requests.get(url=steam_url+'appreviews/'+appid, params=params).json()
    summary["total"] = res["query_summary"]["total_reviews"]
    summary["positive"] = res["query_summary"]["total_positive"]
    summary["score"] = summary["positive"]/ summary["total"]*100
    return summary

# get_reviewSummary("1222670")