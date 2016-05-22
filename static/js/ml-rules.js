var VowelMap  = {
    'ാ': 'ആ',
    'ി': 'ഇ',
    'ീ': 'ഈ',
    'ു':'ഉ',
    'ൂ': 'ഊ', 
    'െ':'എ',
    'േ':'ഏ', 
    'ൈ':'ഐ',
    'ൊ': 'ഒ',
    'ോ': 'ഓ',
    'ൗ': 'ഔ'   
};

var rule_based = function(first, second){
    var l = first.length;
    if(first[l-1] == 'യ' && second[0] in VowelMap){
        // പതിവ് + ആയി  = പതിവായി 
        first = first.slice(0, l-1);
    }

    else if( first[l-1] == 'മ' && second[0] in VowelMap){
        // ഉത്തമം + ആണ് = ഉത്തമമാണ് 
        first = first.slice(0, l-1)+'ം';
    }
    else if (second[0] in VowelMap){
        first = first + '് ';
    }

    //Apply rules to start of second.
    // ദിത്വസന്ധി 
    if(second.length > 2 && 
            second[0]==second[2] && 
            second[1] == '്'){
        second = second.slice(2, second.length);			
    }
    
    if(second[0] in VowelMap){
        second = VowelMap[second[0]] + second.slice(1, second.length);
    }
    return [first, second];
}

