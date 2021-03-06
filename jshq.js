// in-browser content display

var JSHQ = function() {
    $('<style type="text/css" />').text("#content { display: none }").appendTo('head');
    
    // safe onload handler addition courtesy of Simon Willison
    // http://simonwillison.net/2004/May/26/addLoadEvent/
    var addLoadEvent = function(func) {
        var oldonload = window.onload;
        if (typeof window.onload != 'function') {
          window.onload = func;
        } else {
          window.onload = function() {
            if (oldonload) {
              oldonload();
            }
            func();
          }
        }
    };
    
    var getJS = function() {
        if (!window.Template) {
	        var baseURL = JSHQ.getBaseURL();
            $LAB
               .script(baseURL + "lib/wiky.js")
               .script(baseURL + "lib/wiky.lang.js");
        }
        $LAB.block(JSHQ.styleContent);
    };
    
    addLoadEvent(getJS);
    
    return {
        options: {
            
        },
        
        addLoadEvent: addLoadEvent,
        
        // Taken from Dojo
        getBaseURL: function() {
            if( !JSHQ.options.baseURL ) {
                var src = jQuery('script[src$=jshq.js]').attr('src');
                JSHQ.options.baseURL = src.replace(/jshq\.js$/, '');
            }
            return JSHQ.options.baseURL;
        },
        
        getRoot: function() {
            var root = location.href.split('/');
            root.pop();
            $.each(JSHQ.getBaseURL().split('/'), function(i, item) {
                if( item === ".." )
                	root.pop();
                else
                	root.push(item);
            });
            return root.join('/');
        },
        
        getPath: function() {
        	var root = JSHQ.getRoot();
        	return location.href.substr(root.length);
        },
        
        styleContent: function() {
            var baseURL = JSHQ.options.baseURL;
            
            // Brian Grinstead's updated version of Brandon Aaron's
            // outerHTML plugin for jQuery
            $.fn.outerHTML = function() {
                var doc = this[0] ? this[0].ownerDocument : document;
                return $('<div>', doc).append(this.eq(0).clone()).html();
            };
            
            $.get(baseURL + "theme/contentwrap.html", function(data) {
                window.$ = jQuery;
                var currentContent = $("#content").outerHTML();
                var newContent = data.replace("%%HERE%%", currentContent);
                newContent = newContent.replace(/%%BASE%%/g, baseURL);
                $("#content").replaceWith(newContent);
                
                $(".wiki").each(function() {
                    var text = this.innerHTML;
                    var html = Wiky.toHtml(text);
                    $(this).replaceWith(html);
                });
                
                $('#menu > ul > li > a[data-base]').each(function() {
                	var base = $(this).attr('data-base');
                	if ( JSHQ.getPath().substr(0, base.length) === base )
                		$(this).addClass("active");
                });
                if ( !$('#menu > ul > li > a.active').length )
                	$('#menu > ul > li > a:first[data-base="/"]').addClass("active");
                
                $("#content").show();
            });
        }
    }
}();

// LAB.js (LABjs :: Loading And Blocking JavaScript)
// v0.7 (c) Kyle Simpson
// MIT License
(function(a){a.$LAB=function(){var o="undefined",d="string",i="head",g="body",m=true,c=false,b=a.setTimeout,k=a.document,h={head:k.getElementsByTagName(i),body:k.getElementsByTagName(g)},e={},l=null;if(typeof h[i]!==o&&h[i]!==null&&h[i].length>0){h[i]=h[i][0]}else{h[i]=null}if(typeof h[g]!==o&&h[g]!==null&&h[g].length>0){h[g]=h[g][0]}else{h[g]=null}function f(p){if(typeof p===d&&p.length>0){return/^(.*\/)?([^?\/#]*)(\?.*)?(#.*)?$/i.exec(p)[2].toLowerCase()}return""}function n(q){var p=k.getElementsByTagName("script"),r;for(r=0;r<p.length;r++){if(typeof p[r].src===d&&q===f(p[r].src)){return m}}return c}var j=function(u,v){u=!(!u);v=((typeof v===d)?v:i);var z=c,q=null,w=c,y=null,r={},s=[];function t(B){if((this.readyState&&this.readyState!=="complete"&&this.readyState!=="loaded")||B.done){return}this.onload=this.onreadystatechange=null;B.done=m;for(var A in r){if((r[A]!==Object.prototype[A])&&!(r[A].done)){return}}z=m;if(q!==null){q()}}function p(D,C,E,A){var B=f(D);if(typeof C===o){C="text/javascript"}if(typeof E===o){E="javascript"}A=!(!A);if(!A&&(typeof e[B]!==o||n(B))){return}if(typeof r[B]===o){r[B]={done:c}}else{r[B]["done"]=c}e[B]=m;w=m;(function(F){b(function(){var H=null;if(((H=h[F])===null)&&(typeof(H=k.getElementsByTagName(F)[0])===o||H===null)){b(arguments.callee,25);return}var G=k.createElement("script");G.setAttribute("type",C);G.setAttribute("language",E);G.onload=G.onreadystatechange=function(){t.call(G,r[B])};G.setAttribute("src",D);H.appendChild(G)},0)})(v)}function x(A,B){if(u){s.push(A);return B}else{return A()}}y={script:function(){var A=arguments;return x(function(){for(var B=0;B<A.length;B++){if(A[B].constructor===Array){A.callee.apply(null,A[B])}else{if(typeof A[B]==="object"){p(A[B]["src"],A[B]["type"],A[B]["language"],A[B]["allowDup"])}else{if(typeof A[B]===d){p(A[B])}}}}return y},y)},block:function(B){if(typeof B!=="function"){B=function(){}}var A=B,C=new j(m,v);B=function(){try{A()}catch(D){}C.trigger()};return x(function(){if(w&&!z){q=B}else{b(B,0)}return C},C)},toHEAD:function(){return x(function(){v=i;return y},y)},toBODY:function(){return x(function(){v=g;return y},y)},trigger:function(){for(var A=0;A<s.length;A++){s[A]()}}};return y};l={script:function(){return(new j()).script.apply(null,arguments)},block:function(){return(new j()).block.apply(null,arguments)},toHEAD:function(){return(new j()).toHEAD()},toBODY:function(){return(new j()).toBODY()}};return l}()})(window);
