from flask import Flask, request, jsonify
from flask_cors import CORS

# from flask_limiter import Limiter
# from flask_limiter.util import get_remote_address
app = Flask(__name__)
CORS(app)
# importing module (pipeline)
from model import pipeline as analysis
from model import fetch as fetch
# sample = fetch.get_rev('774171', 300)
# df = analysis.remove_noise(sample)
#routes & rate limiter
#doc https://flask-limiter.readthedocs.io/en/stable/#rate-limit-domain


# main page, allow user to input name of game
# page allows input, input calls /search
# http://127.0.0.1:5000/
@app.route("/")
def home():
    return "Hello audrey"

# after user has enter name of game, display search results
# http://127.0.0.1:5000/api/search?title=sims
@app.route("/api/search")
def search():
    title = request.args.get('title')  ## There is it
    gameList = fetch.game_search(title)
    return gameList


# return the game obj w details
# gameID from cheapshark
# TODO: When fetch updated, input is steamappid instead of cheapshark's gameid
# http://127.0.0.1:5000/api/game?id=1222670
@app.route("/api/game")
def game():
    id = request.args.get('id') 
    
    # display data...sample 202589
    game = {}
    game["id"] = id

    game["details"] = fetch.get_game_details(game["id"]) 
    game["RevSummary"] = fetch.get_reviewSummary(game["id"])

    data = fetch.get_rev(game["id"], 300)
    df = analysis.remove_noise(data)
    df = analysis.filterby_score(df)
    df = analysis.sentiment_score(df)

    game["result"] = analysis.polarity_percentage(df)
    
    game["pos_review"] = analysis.review_sample(df, 'pos')
    game["neg_review"] = analysis.review_sample(df, 'neg')
    game["neu_review"] = analysis.review_sample(df, 'neu')

    df = analysis.cluster_clean(df)
    game["keywords"] = analysis.top_cluster(df)

    return jsonify(game)

# http://127.0.0.1:5000/api/currency?value=1&code=JPY
# return new currency converted, else def..USD  (return was CAD tho)
@app.route('/api/currency')
def currency():
    val = request.args.get('value')
    change_code = request.args.get('code')    
    val = fetch.convert_currency(val, change_code)
    return  str(val)

# TODO: Limiter set up
# steam_limiter = Limiter(
#     get_remote_address,
#     app=app,
#     default_limits=["100000 per day", "100 per hour"],
#     storage_uri="memory://",
# )

# cs_limiter = Limiter(
#     get_remote_address,
#     app=app,
#     default_limits=["2400 per day", "100 per hour"],
#     storage_uri="memory://",
# )

# er_limiter = Limiter(
#     get_remote_address,
#     app=app,
#     default_limits=["100 per month"],
#     storage_uri="memory://",
# )

if __name__ == "__main__": 
    app.run(host='0.0.0.0', port=8080, debug=True)