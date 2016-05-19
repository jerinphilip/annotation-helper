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

var rule_based_transforms = function(splits){
    for(var i=0; i<splits.length-1; i++){
        var first = splits[i];
        var second = splits[i+1];

        //Apply rules to ending of first.
        var l = first.length;
        console.log(first[l-1]);
        console.log(first[l-1] == 'മ');
        console.log(second[0]);
        console.log(second[0] in VowelMap);
        if(first[l-1] == 'യ' && second[0] in VowelMap){
			// പതിവ് + ആയി  = പതിവായി 
            first = first.slice(0, l-1);
        }

        else if( first[l-1] == 'മ' && second[0] in VowelMap){
			// ഉത്തമം + ആണ് = ഉത്തമമാണ് 
			console.log("Got into ma");
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
            console.log(VowelMap[second[0]]);
            second = VowelMap[second[0]] + second.slice(1, second.length);
        }
        
        //ToDo - ദീര്‍ഘസന്ധി 
        //eg: വര്‍ഷാവാസാനം 

        splits[i] = first;
        splits[i+1] = second;

    }
    return splits;

}
