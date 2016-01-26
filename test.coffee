trieFactory = require "./index.coffee"
PriorityQueue = require "js-priority-queue"

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


trie2  = trieFactory trieFactory.numToStr 4, 20

numbers = ( 1000 * (Math.random() - Math.random()) for i in [1..1000000])

#for x in numbers
#    trie2.add x

#console.log JSON.stringify trie2.getAt 0, 10

pq = new PriorityQueue comparator: (a,b) ->
     a - b

for x in numbers
    pq.queue x

numbers.sort (x,y) ->
    x - y

for x, i in numbers
    y  = pq.dequeue()
    if x is y
        #console.log "#{i}. Ok (#{x.toString()})"
    else
        console.error "#{i}. FAILURE: #{x.toString()} isnt #{y.toString()}"
