removeAllFromArray = (a,e) ->
    x for x in a when x isnt e

min = Math.min

prefix = (w1, w2) ->
    len = min w1.length, w2.length
    for i in [0..len]
        break if (w1.charAt(i) isnt w2.charAt(i))
    w1.slice 0, i

addLeave = (node, element) ->
    node.leaves ?= []
    node.leaves.push element
    node

splitNode = (x,n) ->
    y =
        size:   x.size - 1
        prefix: x.prefix.slice n + 1
        leaves: x.leaves
        dict:   x.dict
        order:  x.order
    x.dict   = {}
    x.dict[x.prefix.charAt(n)] = y
    x.order  = [x.prefix.charAt(n)]
    x.prefix = x.prefix.slice 0, n
    x.leaves = []
    y

mergeUniqueChild = (n) ->
    theChild = n.dict[n.order[0]]
    n.prefix += n.order[0] + theChild.prefix
    n.dict = theChild.dict
    n.leaves = theChild.leaves
    n.order = theChild.order
    n

addToTrie = (t, x, s) ->
    # t - trie, x - element , s - toStr(x)
    while ( true )
        t.size++
        p = prefix t.prefix, s
        if ((p.length is s.length) and (p.length is t.prefix.length))
            # s = t.prefix = p
            addLeave t, x
            return
        if (p.length is s.length) # p = s < t.prefix
            splitNode t, p.length # !!!!
            addLeave t, x
            return
        if (p.length isnt t.prefix.length) # p < t.prefix, p < s
            splitNode t, p.length
            t.dict[s.charAt(p.length)] =
                size:1
                prefix:s.slice p.length + 1
                leaves:[x]
                dict:{}
                order:[]
            t.order.push s.charAt p.length
            t.order.sort()
            return
        # if (p.length === t.prefix.length) i.e.,  p = t.prefix < s
        q = t.dict[s.charAt p.length]
        if (not q)
            t.dict[s.charAt p.length] =
                size:1
                prefix:s.slice p.length + 1
                leaves:[x]
                dict:{}
                order:[]
            t.order.push s.charAt p.length
            t.order.sort()
            return
        t = q
        s = s.slice p.length + 1  # continue

delInTrie = (t,x,s) ->
    # x has to be in trie !!!!
    if (s.length is t.prefix.length)
        old_length = t.leaves.length
        t.leaves = removeAllFromArray t.leaves, x
        t.size += t.leaves.length - old_length
        if ((t.leaves.length is 0) and (t.order.length is 1))
            mergeUniqueChild t
    else
        s = s.slice t.prefix.length
        a = s.charAt 0
        theChild = t.dict[a]
        old_size = theChild.size
        t_a = delInTrie theChild, x, s.slice 1
        t.size +=  t_a.size - old_size
        if (t_a.size is 0)
            delete t.dict[a]
            t.order = removeAllFromArray t.order, a
            if ((t.leaves.length is 0) and (t.order.length is 1))
                mergeUniqueChild t
    t

# Trie for radix sort for objects with String representation (by
# default "toString()"). Even for strings you may want to use
# something like "function(x){return x.toUpperCase();}"

class Trie
    constructor: (@toStrFn) ->
        @toStrFn ?= (x) ->
            x.toString()
    trie:
       size:   0
       prefix: ''
       leaves: []
       dict:   {}
       order:  []

    add: (x) ->
        @trie =
            size:1
            prefix: @toStrFn(x)
            leaves:[x]
            dict:{}
            order:[]
        @add = (x) -> addToTrie @trie, x, @toStrFn x

    del: (x) ->
        @trie = delInTrie @trie, x, @toStrFn x
        @

############### USER INTERFACE #################

    find: (elem) ->
        # returns the position of elem (in alphabetical order) 
        searchResult = @findByKey @toStrFn elem
        for i in [0..searchResult.res.length]
            return searchResult.pos + i if (searchResult.res[i] is elem)
        null # should we change it to -1 ?

    findByKey: (key) ->
        # returns {pos: number, res: Array of objects }
        findInTrie @trie, key

    getKeys: ->
        # returns the ordered array of all keys
        trieGetKeys @trie

    toString: ->
        size = @trie.size
        head = 3
        tail = 3
        if (size <= head + tail + 4)
            return "trie[#{@getAt 0, size}].size=#{size}"
        "trie[#{@getAt 0, head},...,#{@getAt size-tail, tail}].size=#{size}"

    getNth: (n) ->
        (getAtInTrie @trie, n, 1)[0]

    getAt: (start, n) ->
        # returns an array of n elements at positions [start,
        # start+1, ..., start+n-1]  Naturally, the result will be shorter that
        # "n" if "start + n" is bigger than the size of the trie.
        getAtInTrie @trie, start, n

    size: ->
        @trie.size

#### Implementation of the user interface ###########

trieGetKeys = (t) ->
    res = []
    res.push t.prefix if (t.leaves?.length > 0)
    for a in t.order
        for p in trieGetKeys t.dict[a]
            res.push t.prefix + a + p
    res

findInTrie = (t,s) ->
    # 's' is the string key
    p = prefix t.prefix, s
    return null if (p.length < t.prefix.length)
    if (p.length < s.length)
        pos = t.leaves.length
        for a in t.order
            if (a is s.charAt p.length)
                aux = findInTrie t.dict[a], s.slice p.length + 1
                if (aux)
                    return { pos:pos + aux.pos, res: aux.res}
                return null
            pos += t.dict[a].size
        return null;
    {pos:0, res:t.leaves}

getAtInTrie = (t,start,n) ->
    return [] if (n is 0) or (t.size <= start)
    res = []
    if (start < t.leaves.length)
        res = t.leaves.slice start, start+n
        n  -= res.length
        start = 0
    else
        start -= t.leaves.length
    for a in t.order
        if (start < t.dict[a].size)
            aux = getAtInTrie t.dict[a], start, n
            n -= aux.length
            start = 0
            res = res.concat aux
        else
            start -=  t.dict[a].size
    res

module.exports = (indexFn) ->
    new Trie indexFn

module.exports.numToStr = (size, prec, number) ->
    do (prefix = "", str = "", n = "", rest = "") -> 
        if number >= 0
            prefix = ""
        else
            prefix = "-"
            number = - number
        str = ""+number
        [n,rest] = str.split "."
        rest ?= ""
        n = n.toString()
        while (n.length < size)
            n = "0" + n
        if n.length isnt size
            throw new Error "Number #{number} not stringifiable into {\##{size}}.{\##{prec}}"
        while (rest.length < prec)
            rest = rest + "0"
        if rest.length isnt prec
            throw new Error "Number #{number} not stringifiable into {\##{size}}.{\##{prec}}"
        if prefix is "-"
            n = ("#{9-x}" for x in n).join ""
            rest = ("#{9-x}" for x in rest).join ""
        if prec > 0
            return prefix + n + "." + rest unless rest is ""
        return prefix + n
