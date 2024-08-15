# StEAM REVIEW SENTIMENT ANALYSIS
***
A Full-stack Dockerized A Flask-React Dockerized Application
![App Preview](https://github.com/audreylearns/steamGameComparisonAnalysis/blob/main/app_preview.gif "App Preview")

***
- Performs a sentiment analysis and text clustering
- Utilizes pandas' dataframe and pretrained [ roBERTa-base model ](https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment) on Valve API's review
- Utilizes Natural Language Toolkit modules, WordNetLemmatizer, punkt, pos_tag and FreqDist for clustering analysis
- Designed backend with Flask
- Designed frontend with Reacr
***


#### Prerequisites & Instructions
- Download & Install: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Recommended IDE: Visual Studio Code
- Clone this repo, or download the .zip and unzip
- On your command line, enter 
```docker-compose up```
- On your browser visit: [Local host](http://localhost:3000/)

***
#### Method: 
- Data exploation- store & manipulate tabular data using Panda's dataframe
- Filtering - Helpful reviews processed based on Steam's user review votes
- Data Cleanup - find & replace review entries with Python's Regexp 
- Tokenizer - break down of human language for machine learning analysis
- Lemmatize - the process of reducing the different forms of a word to one single form
- Docker Compose - runs a network of 2 containers: machine learning model flask-backend and react front end

![Sentiment](https://github.com/audreylearns/steamGameComparisonAnalysis/blob/main/prev_2.png "Sentiment Preview")
![Clustering](https://github.com/audreylearns/steamGameComparisonAnalysis/blob/main/prev_3.png "Clustering Preview")
***
Owner: Audrey Duzon GitHub: https://github.com/audreylearns Release Verssion: 1 - 08/15/2024

***