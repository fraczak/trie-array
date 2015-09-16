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


trie2  = trieFactory (obj) ->
    key = trieFactory.numToStr 1, 20, obj

numbers = ( Math.random() - Math.random() for i in [1..10])

for x in numbers
    trie2.add x

console.log JSON.stringify trie2.getAt 0, 10



numbers.sort (x,y) ->
    x - y

for x, i in numbers
    y  = trie2.getNth i
    if x is y
        console.log "#{i}. Ok (#{x})"
    else
        console.error "#{i}. FAILURE: #{x} isnt #{y}"
