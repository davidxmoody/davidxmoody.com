---
layout: post
title: "MCTS in Texas Hold 'em Poker: A retrospective"
---

I've recently been uploading a lot of my old projects. Both to prove I've actually done them and also in case someone might be interested.

This week, I have uploaded my 3rd year Cambridge University dissertation project. It is a **Texas Hold 'em poker-bot** which uses the **Monte Carlo Tree Search algorithm**. You can [view the source on GitHub](https://github.com/davidxmoody/mctsbot). In this post, I am going to give a very brief summary of the project and make notes on how I could have done better.


## How to build a poker-bot

My poker-bot runs as a plugin to [Poker Academy Pro](http://www.poker-academy.com/poker-software/), a commercial program which can run custom bots written in Java. It also came with a nice little example poker-bot called SimpleBot. I based most of my dissertation around how well my poker-bot (MCTSBot) could play against SimpleBot. 

![Screenshot of Poker Academy Pro](/images/mcts-in-texas-hold-em-poker-a-retrospective/PAP1-800x.png)

I'm not going to write a complete description of the Monte Carlo Tree Search algorithm in this post. If you are interested, you can check out chapters 2.4 and 2.5 of [my dissertation (PDF)][diss].

For now, I'll just say that it uses random simulations to gradually build up a partial game tree. It uses advanced strategies to find a balance between *exploring* new branches and *exploiting* the most promising branches.

I discovered that a decent **opponent model** was vital to the success of the program. An opponent model helps to predict what moves an opponent will make and increases the accuracy of simulations. To create one, I used [Weka](http://www.cs.waikato.ac.nz/ml/weka/), a handy set of open source machine learning algorithms. I would have loved to create my own machine learning algorithms but it would have been well beyond the scope of the project. 

I also spent a lot of time creating tools to extract and analyse the data. I even wrote a simple graphical user interface which ran beside Poker Academy Pro. It displayed a *live view* of the expected values of each possible move as it was calculating them. 

![Screenshot of my GUI](/images/mcts-in-texas-hold-em-poker-a-retrospective/GUI.png)

## Results

The purpose of my dissertation was not only to build a working poker-bot but also to analyse its performance in different situations. Again, I recommend you check out chapter 4 of [my full dissertation (PDF)][diss] for a proper explanation. 

By the end of the project, my poker-bot was consistently able to beat SimpleBot. However, it was a tough battle to get there. The following graph shows MCTSBot's performance with and without the two different opponent models I used (**H**and **R**ank **O**pponent **M**odel and **N**ext **M**ove **O**pponent **M**odel). It shows that both models were required to turn a positive average profit. 

![Graph showing the effectiveness of different opponent models](/images/mcts-in-texas-hold-em-poker-a-retrospective/SBvMB-oppmodels-v2.png)

I also explored how other parameters affected performance. Here is a quick graph of MCTSBot's performance as its thinking time is varied.

![Graph showing the effects of varying thinking time](/images/mcts-in-texas-hold-em-poker-a-retrospective/SBvMB-time.png)

Again, this blog post really isn't meant to be a complete summary of the project. If you are interested, I recommend reading chapters 2 and 4 of [my full dissertation (PDF)][diss].

## Advice for my past-self

Over three terms, my time log shows that I spent about *300 hours* on the project. I got a grade of *69/100* for my dissertation which I was pleased with. 

However, I still made plenty of mistakes. By far my biggest problem was *overconfidence*. I had completed almost the entire program by the half-way point. I thought the data collection and analysis would be easy. I didn't even start it until the beginning of the final term. 

Of course, it wasn't easy. It was one of the hardest and most time consuming parts of the project. Running simulations was a very slow process. My computer was probably running at max capacity for about three weeks straight. I did a pretty good job but I still feel that with a week extra, I could have gotten another 5-10 marks easily. 

Another thing I noticed about my dissertation is that plain English is *very bad* for describing program structure. My project supervisor urged me to include some diagrams but I just ran out of time. I should have heeded his advice earlier and included a few really good diagrams to explain the MCTS algorithm. 

Looking through the source code, I also notice a lot of [code smells](http://blog.codinghorror.com/code-smells/). Things like long methods, duplicated code, commented out code and lots of methods which do very similar things.

Looking back at it now, I do feel slightly embarrassed. It was my first ever major project and I didn't really know what I was doing. At least I know better now, at least I like to think I do :)

If I could only give one piece of advice to my past-self, it would be this: *Get it done ASAP*. 

[diss]: https://github.com/davidxmoody/mctsbot/raw/master/Dissertation.pdf
