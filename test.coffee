trieFactory = require "./index.coffee"
trie = trieFactory (obj) ->
    key = obj.word.toUpperCase()

for word, index in ['A','character','is','that','of','a','typical','hero']
    trie.add {word,index}

trie.add elem =
    word: "IS"
    status: "transient"

console.log JSON.stringify trie.findByKey 'IS'

trie.del elem

console.log JSON.stringify trie.findByKey 'IS'

console.log JSON.stringify trie.getNth 3

console.log JSON.stringify trie.getAt 4, 2
