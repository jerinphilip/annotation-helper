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
    if((first[l-1] == 'യ' or first[l-1]=='വ') && second[0] in VowelMap){
        // പതിവ് + ആയി  = പതിവായി 
        first = first.slice(0, l-1);
    }
    
    else if((second[0] == 'യ' or second[0]=='വ') && second.length > 3 && 
            second[1]==second[3] && 
            second[2] == '്'){
            // Dont even ask
            second = 'അ'+second.slice(1, second.length);
    }

    else if( first[l-1] == 'മ' && second[0] in VowelMap){
        // ഉത്തമം + ആണ് = ഉത്തമമാണ് 
        first = first.slice(0, l-1)+'ം';
    }
    else if (second[0] in VowelMap){
        first = first + '്';
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

var split_a = function(first, second){
    first = first + '്';
    second = 'അ'+second;
    return [first, second];
}

/*
var rule_based = function(first, second){
	var l = first.length;
	if(second[0] == 'യ' && second[1] in VowelMap){
		second = VowelMap[second[1]] + second.slice(2, second.length);
	}
	else if(second[0] == 'യ'){
		second = 'അ' + second.slice(1, second.length);
	}
	else if(second[0] == 'മ' && second[1] in VowelMap){
		first = first + 'ം';
		second = VowelMap[second[1]] + second.slice(2, second.length);
	}
	else if(second[0] == 'മ'){
		first = first + 'ം';
		second = 'അ' + second.slice(1, second.length);
	}
	
	if(second.length > 2 && 
            second[0]==second[2] && 
            second[1] == '്'){
        second = second.slice(2, second.length);			
    }
	
	if(second[0] in VowelMap){
		second = VowelMap[second[0]] + second.slice(1, second.length);
		first = first + '്';
	}
	
	return [first, second];
};
*/
