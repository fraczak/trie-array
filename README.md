trie
====

Simple and fast implementation of a `trie`, <https://en.wikipedia.org/wiki/Trie>.
To install:

    npm install git://github.com/fraczak/trie.git

To use in coffee script:

    trieFactory = require "./index.coffee"
    trie = trieFactory (obj) ->
      key = obj.word.toUpperCase()

    for word, index in ['A','character','is','that','of','a','typical','hero']
      trie.add {word,index}

    trie.add elem = { word: "IS", status: "transient" }
    
    trie.findByKey 'IS'
    ## finds all objects with key 'IS'
    ## -> {"pos":4,"res":[{"word":"is","index":2},{"word":"IS","status":"transient"}]}
    
    trie.del elem
    
    trie.getNth 3
    ## gets the 3rd element in 'key' order
    ## -> {"word":"hero","index":7}
    
    trie.getAt 4, 2
    ## gets 2 elements starting at position 4
    ## -> [{"word":"is","index":2},{"word":"of","index":4}]



  
