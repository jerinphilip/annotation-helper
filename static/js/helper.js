$(document).ready(function(){
    var word=null;
    var words = [];
    var locations = [];
    var activeWord = null;

    var id = function(x, y){
        return [x, y];
    };
    var activeRule = rule_based;
    var ruleDict = {};

    var transforms = function(word, locations){
        var splits = [];
        var current = 0;
        for(var i=0; i<locations.length; i++){
            var pos = locations[i];
            var currentWord = word.slice(current, pos);
            splits.push(currentWord);
            current = pos;
        }

        var lastWord = word.slice(current, word.length);
        splits.push(lastWord);

        for(var i=0; i<splits.length-1; i++){
            var first = splits[i];
            var second = splits[i+1];

            var f = ruleDict[locations[i]];
            var result = f(first, second);

            splits[i] = result[0];
            splits[i+1] = result[1];

        }
        return splits;

    }

    var status_pane_reset = function(){
        splits = transforms(word, locations);
        words = splits;
        var content = splits.join('+')
        $('#statuspane').html(content);
    };

    $("#phase-2").hide();
    $('#textAreaSubmit').click(function(){
        //Get text area contents.
        var content = $('#textInput').val();

        //Regex to trim punctuations and numbers.
        content = content.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\'0-9]/g,"");

        var words = content.split(' ');
        words = words.filter(function(x){
            //Set threshold here, for convenience.
            return x.length >= 10;
        });
        //console.log(words);

        //Filtered words, add to wordpool
        $("#wordpool").html('');
        for(var i=0; i<words.length; i++){
            var container = document.createElement('div');
            container.className = 'word-button';
            var span = document.createElement('div');
            var button = document.createElement('button');
            button.className = 'btn btn-danger delete-word';
            button.innerHTML = 'x';
            span.className="word";
            span.innerHTML = words[i];
            container.appendChild(span);
            container.appendChild(button);
            $("#wordpool").append(container);
        }
        $("#phase-1").hide(); //Make phase-1 passive
        $("#phase-2").show(); //Make phase-2 active.
    });

    $('#finalSubmit').click(function(){

        //Sort locations
        var str = function(num){ return (num-1).toString(); };
        var sortedLocations = locations.map(str);

        var data = {
            "word" : word,
            "split_word" : words.join('+'),
            "split_location" : sortedLocations.join(','),
            "lang": "ml"
        };
        $.ajax({
            url: '/add',
            method: 'POST',
            data: data,
            success: function(response){
                //On success, remove word from pool.
                activeWord.remove();
            }
        });

        //Cleanup
        locations = [];
        words = [];
        word = null;
    });

    $(document).on('click', '.word', function(e){
        word = e.target.innerHTML;
        locations = [];
        words = [];
        $("#editpane").html('');
        activeWord = $(this).parent();
        for(var i=0; i<word.length-1; i++){
            var span = document.createElement('div');
            var button = document.createElement('button');
            button.className = 'btn add-location';
            button.dataset.next = i+1;
            button.innerHTML = '+';
            span.className="character";
            span.innerHTML = word[i];
            $("#editpane").append(span);
            $("#editpane").append(button);

        }
        var span = document.createElement('div');
        span.className="character";
        span.innerHTML = word[word.length-1];
        $("#editpane").append(span);
        $('#statuspane').html('statuspane');
        console.log("Click detected");
    });

    $(document).on('click', '.delete-word', function(e){
        //On reject, delete word.
        var container = $(this).parent();
        console.log(container.innerHTML);
        container.remove();
    });

    $(document).on('click', '.add-location', function(e){
        //On reject, delete word.
        var pos = Number(e.target.dataset.next);
        var found = locations.indexOf(pos)
        var compare = function(a, b){ return a - b; };

        if(found != -1){
            locations.splice(found, 1);
            ruleDict[found] = id;
        }
        else{
            locations.push(pos);
            ruleDict[pos] = activeRule;
            locations = locations.sort(compare);
        }
        status_pane_reset();
        console.log(locations);
    });

    $("#auto-rule").click(function(){
        console.log("Auto rule enabled");
        activeRule = rule_based;
    });
    
     $("#auto-a-rule").click(function(){
        console.log("Auto rule enabled");
        activeRule = split_a;
    });
    $(".rule-select").click(function(e){
        console.log("Rule select clicked");
        t = e.target;
        x = t.dataset.x;
        y = t.dataset.y;
        xt = t.dataset.xt;
        yt = t.dataset.yt;
        console.log({"x": x, "y": y, "xt":xt, "yt":yt});

        var f = function(first, second){
            fx = first.slice(first.length-x.length, first.length);
            sy = second.slice(0, y.length);
            console.log("fx="+fx);
            console.log("x="+x);
            console.log("y="+y);
            console.log("sy="+sy);
            if(fx == x)
                tx = first.slice(0, first.length-x.length) + xt;
            else
                tx = first;
            if(sy == y)
                ty = yt + second.slice(y.length, second.length) ;
            else
                ty = second;
            return [tx, ty];
        };

        activeRule = f;
    });
});
