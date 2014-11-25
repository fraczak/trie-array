var trie = require("./index");
/************** FOR DEBUGGING ***************/

function dumpTrie(t){// for debugging only
    if (! t) {
        return "()"
    };
    var i;
    var res = "<"+t.size+":"+t.prefix+">";
    if (t.leaves) {
        if (t.leaves.length > 0) {
            res += "[ " + t.leaves[0];
             for (i=1; i < t.leaves.length; i++){
                 res += ", " + t.leaves[i];
             };
            res += "]";
        } else { res += "[]"; };
    };
    res += "(";
    if (t.dict){
        for (i in t.dict){
            res += i + "."+dumpTrie(t.dict[i]);
        };
    };
    res += ")";
    return res;
};

/***************** TESTS *************************/

function equalP(a1,a2){
    if (a1.length !== a2.length) return false;
    for (var i = 0; i< a1.length; i++){
        if (a1[i] != a2[i]) return false;
    };
    return true;
};

var print = console.log;

/* test 1 */
print("Test 1");
var t1 = trie(function(x){return x.toUpperCase();});
var test =["","a","aa","aaa","aa","a","","bbb","bb","b",""];
for (var i = 0; i < test.length; i++){ t1.add(test[i]); };

print("t1 = "+t1);
print("... " +  (equalP(test.sort(),t1.getAt(0,t1.size())) ? "PASSED" : "FAILED"));

/* test 2 */

print("Test 2");
var texte = "/home/wojtek/slideshow-no-sound.vob.dv/home/wojtek/slideshow-no-sound.vob.dv/home/wojtek/slideshow-no-sound.vob.dvThe first argument of parseInt must be a string or a string expression. The result returned by parseInt is an integer whose representation was contained in the string (or the integer found in the beginning of the string). The second argument base, if present, specifies the base (radix) of the number whose string representation is contained in the string. The base argument can be any integer from 2 to 36. If there is only one argument, the number base is detected according to the general JavaScript syntax for numbers. Strings that begin with 0x or -0x are parsed as hexadecimals; strings that begin with 0 or -0 are parsed as octal numbers. All other strings are parsed as decimal numbers. If the string argument cannot be parsed as an integer, the result will be NaN (or 0 in very old browsers such as Internet Explorer If there is only one argument, the number base is detected according to the general JavaScript syntax for numbers. Strings that begin with 0x or -0x are parsed as hexadecimals; strings that begin with 0 or -0 are parsed as octal numbers. All other strings are parsed as decimal numbers. If the string argument cannot be parsed as an integer, the result will be NaN (or 0 in very old browsers such as Internet Explorer If there is only one argument, the number base is detected according to the general JavaScript syntax for numbers. Strings that begin with 0x or -0x are parsed as hexadecimals; strings that begin with 0 or -0 are parsed as octal numbers. All other strings are parsed as decimal numbers. If the string argument cannot be parsed as an integer, the result will be NaN (or 0 in very old browsers such as Internet Explorer";
t2 = trie();
test = texte.match(/[a-zA-Z]+/g);
for (var i = 0; i < test.length; i++){
    t2.add(test[i]);
};
print("t2 = "+t2);
print("... " +  (equalP(test.sort(),t2.getAt(0,t2.size())) ? "PASSED" : "FAILED"));

/* test 3 */
print("Test 3");
function S(str,num){
    this.num = num || 0;
    this.str = str;
    this.toString = function(){ return this.str+"["+this.num+"]";};
};

var t3 = trie(function(x){return x.str;});
for (var i=0; i< test.length; i++){
    t3.add(new S(test[i],i));
};
print("t3 = "+t3);
