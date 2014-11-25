/**************************************************/
 function removeAllFromArray(a,e){
     var res = [];
     for (var i=0,j=0;i<a.length; i++){
         if (a[i]===e) continue;
         res[j]=a[i];
         j++;
     }
     return res;
 };

/***************************************************/

// Trie for radix sort for objects with String representation (by
// default "toString()"). Even for strings you may want to use
// something like "function(x){return x.toUpperCase();}"

function Trie(toStrFn){
    toStrFn = toStrFn || function(x){return x.toString()};

    function min(x,y){ return (x <y) ? x : y; };
    function prefix(w1,w2){
        var i; // first different letter
        var len = min(w1.length, w2.length);
        for (i = 0; i <len; i++){
            if (w1.charAt(i) !== w2.charAt(i)) break;
        };
        return w1.slice(0,i);
    };
    function addLeave(node,element){
        if (! node.leaves) { node.leaves = [element]; }
        else { node.leaves.push(element); };
    };
    function splitNode(x,n){
        var y = {size:x.size - 1, prefix:x.prefix.slice(n+1),
                 leaves:x.leaves, dict:x.dict, order:x.order};
        x.dict={};
        x.dict[x.prefix.charAt(n)] = y;
        x.order=[x.prefix.charAt(n)];
        x.prefix = x.prefix.slice(0,n);
        x.leaves = [];
        return y;
    };
    function mergeUniqueChild(n){
        var theChild = n.dict[n.order[0]];
        n.prefix += n.order[0]+theChild.prefix;
        n.dict = theChild.dict;
        n.leaves = theChild.leaves;
        n.order = theChild.order;
        return n;
    };
    this.trie = {size:0, prefix:'',leaves:[],dict:{}, order:[]};
    this.add = function(x){
        this.trie ={size:1,prefix:toStrFn(x),leaves:[x],dict:{}, order:[]};
        this.add =
            function(x){
                var s = toStrFn(x);
                var t = this.trie;
                while ( true ) {
                    t.size++;
                    var p = prefix(t.prefix, s);
                    if ((p.length === s.length) && (p.length === t.prefix.length)){
                        // s = t.prefix = p
                        addLeave(t,x);
                        return;
                    };
                    if (p.length === s.length){ // p = s < t.prefix
                        splitNode(t,p.length); // !!!!
                        addLeave(t,x);
                        return;
                    };
                    if (p.length !== t.prefix.length)  { // p < t.prefix, p < s
                        splitNode(t,p.length);
                        t.dict[s.charAt(p.length)] =
                            {size:1,prefix:s.slice(p.length +1),leaves:[x],dict:{}, order:[]};
                        t.order.push(s.charAt(p.length));
                        t.order.sort();
                        return;
                    };
                    // if (p.length === t.prefix.length) i.e.,  p = t.prefix < s
                    var q = t.dict[s.charAt(p.length)];
                    if (! q) {
                        t.dict[s.charAt(p.length)] =
                            {size:1,prefix:s.slice(p.length +1),leaves:[x],dict:{},order:[]};
                        t.order.push(s.charAt(p.length));
                        t.order.sort();
                        return;
                    }
                    t = q;
                    s = s.slice(p.length +1);  // continue
                };
            };
    };
    this.del = function(x){
        function delInTrie(t,s){
            // x has to be in trie !!!!
            if (s.length === t.prefix.length) {
                var old_length = t.leaves.length;
                t.leaves = removeAllFromArray(t.leaves,x);
                t.size +=  t.leaves.length - old_length;
                if ((t.leaves.length === 0) && (t.order.length === 1)){
                    mergeUniqueChild(t);
                };
            } else {
                s = s.slice(t.prefix.length);
                var a = s.charAt(0);
                var theChild =t.dict[a];
                var old_size = theChild.size;
                var t_a = delInTrie(theChild,s.slice(1));
                t.size +=  t_a.size - old_size;
                if (t_a.size === 0){
                    delete t.dict[a];
                    t.order = removeAllFromArray(t.order,a);
                    if ((t.leaves.length === 0) && (t.order.length === 1)){
                        mergeUniqueChild(t);
                    };
                };
            };
            return t;
        };
        this.trie = delInTrie(this.trie,toStrFn(x));
        return this;
    };

    /********************** USER INTERFACE *************************/


    this.find = function(elem){
        // returns the position of elem (in alphabetical order) 
        var searchResult = this.findByKey(toStrFn(elem));
        for (var i = 0; searchResult.res.length; i++){
            if (searchResult.res[i] === elem) {
                return searchResult.pos + i;
            };
        };
        return null; // should we change it to -1 ?
    };

    this.findByKey = function(key){ // returns {pos: number, res: Array of objects }
        return findInTrie(this.trie,key);
    };

    this.getKeys = function(){ // returns the ordered array of all keys
        return trieGetKeys(this.trie);
    };

    this.toString = function(){
        var size = this.trie.size;
        var head = 6;
        var tail = 6;
        if (size <= head + tail){
            return "trie[" + this.getAt(0,size) + "].size="+size;
        } else {
            return "trie[" + this.getAt(0,head) +
                ", ..., " + this.getAt(size-tail,tail) +"].size="+size;
        };
    };

    this.getNth = function(n){
        return getAtInTrie(this.trie,n,1)[0];
    };

    this.getAt = function(start,n){
        // returns an array of n elements at positions [start,
        // start+1, ..., start+n-1]  Naturally, the result will be shorter that
        // "n" if "start + n" is bigger than the size of the trie.
        return getAtInTrie(this.trie,start,n);
    };

    this.size = function(){
        return this.trie.size;
    };

    /****** Implementation of the user interface ********/

    function trieGetKeys(t){
        var res = [];
        if (t.leaves) {
            if (t.leaves.length > 0) res.push(t.prefix);
        };
        for (var i = 0; i < t.order.length; i++){
            var a = t.order[i];
            var aux = trieGetKeys(t.dict[a]);
            for( var j = 0; j < aux.length; j++){
                res.push(t.prefix + a + aux[j]);
            };
        };
        return res;
    };

    function findInTrie(t,s){ // 's' is the string key
        var p = prefix(t.prefix,s);
        if (p.length < t.prefix.length) return null;
        if (p.length < s.length){
            var pos = t.leaves.length;
            for(var i = 0; i < t.order.length; i++){
                if (t.order[i] === s.charAt(p.length)) {
                    var aux = findInTrie(t.dict[t.order[i]], s.slice(p.length+1));
                    if (aux){
                        return {pos:pos + aux.pos, res:aux.res};
                    };
                    return null;
                } else {
                    pos += t.dict[t.order[i]].size;
                };
            };
            return null;
        };
        return {pos:0,res:t.leaves};
    };

    function getAtInTrie(t,start,n){
        if (n === 0) return [];
        if (t.size <= start) return [];
        var res;
        if (start < t.leaves.length){
            res = t.leaves.slice(start,start+n);
            n  -= res.length;
            start = 0;
        } else {
            start -= t.leaves.length;
            res = [];
        };
        for (var i=0; i < t.order.length; i++){
            if (start < t.dict[t.order[i]].size){
                var aux = getAtInTrie(t.dict[t.order[i]],start,n);
                n -= aux.length;
                start = 0;
                res = res.concat(aux);
            } else {
                start -=  t.dict[t.order[i]].size;
            };
        };
        return res;
    };
};

/***********************/

module.exports = function(x){
    return new Trie(x);
};
