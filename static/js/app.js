 	var config;
    var baseUrl = 'http://api.themoviedb.org/3/';
    var apiKey = '04f6ee1bf901f1be2ec68e1276ab7ac2';


    function initialize(callback) {
        $.get(baseUrl + 'configuration', {
            api_key: '04f6ee1bf901f1be2ec68e1276ab7ac2'
        },function(res) {
            config = res;
            console.log(config);
            callback(config);
        });
    }

    function setEventHandlers(config) {
        $('#form-search').submit(function() {
            var query = $('.input-query').val();
            searchMovie(query);
            return  false;
        });

        $('.btn-now-showing').click(function() {
            loadNowShowing();
        });

        loadNowShowing();

        $('.btn-upcoming').click(function() {
            upcoming();
            
        });

        upcoming();

        $('.btn-popular').click(function() {
            popular();
            
        });

        popular();

        $('.btn-top-rated').click(function() {
            toprated();
            
        });

        toprated();
    }
    function searchMovie(query) {
        var searchUrl = baseUrl + 'search/movie';
        $('.movies-list').html('');
        $.get(searchUrl, {
            query: query,
            api_key: apiKey
        }, function(response) {
            displayMovies(response);
        });
    }


    function displayMovies(data,category) {
        $('.movies-list').html('');
        if(data.results.length > 0){
            var headerStr = [
                            '<div class="col-md-12">',
                            '<hr>',
                            '</div>'
                        ];
                         $('.movies-list').append($(headerStr.join('')));

        data.results.forEach(function(movie){
            var imageSrc = config.images.base_url + config.images.poster_sizes[3] + movie.backdrop_path;
            var imagesrc = config.images.base_url + config.images.poster_sizes[3] + movie.poster_path;
               var object = {
                    "movie-id" : movie.id,
                    "img" : imageSrc,
                    "imaged" : imagesrc,
                    "title": movie.title

               };
        var raw = $("#tpl-displaymovies").html();
        var template = Handlebars.compile(raw);
        var html = template(object);
        $('.movies-list').append(html);

           })();
        }

        else{
            var htmlStr = [
                    '<h2>',
                        'No Results Found.',
                    '</h2>'
            ];
            $('.movies-list').append($(htmlStr.join('')));
        }
    }
    

    function upcoming() {
        var upcomingUrl = baseUrl + 'movie/upcoming';
        $('.movies-list').html('');
        $.get(upcomingUrl, {
            api_key: apiKey
        }, function(response) {
            displayMovies(response, "Upcoming Movies");
        });
    }
    

    function popular() {
        var popularUrl = baseUrl + 'movie/popular';
        $('.movies-list').html('');
        $.get(popularUrl, {
            api_key: apiKey
        }, function(response) {
            displayMovies(response, "Popular Movies");
        });
    }

    function toprated() {
        var topratedUrl = baseUrl + 'movie/top-rated';
        $('.movies-list').html('');
        $.get(topratedUrl, {
            api_key: apiKey
        }, function(response) {
            displayMovies(response, "Top Rated Movies");
        });
    }
    
    function loadNowShowing() {
        var nowShowingUrl = baseUrl + 'movie/now_playing';
        $('.movies-list').html('');
        $.get(nowShowingUrl, {
            api_key: apiKey
        }, function(response) {
            displayMovies(response, "Now Showing");
        });
    }    

    function viewMovie(id){
    $(".movie-list").hide();
    console.log(id);
    url = baseUrl + "movie/"+id;
    reqParam = {api_key:apiKey};
    $.get(url,reqParam,function(response){
        $("#title").html(response.original_title);

        $("#overview").html(response.overview);

        url = baseUrl + "movie/"+id+"/videos";
        $.get(url,reqParam,function(response){
            var html = '<embed width="700" height="490" src="https://www.youtube.com/v/'+response.results[0].key+'" type="application/x-shockwave-flash">'
            $("#trailer").html(html);
        });


        url = baseUrl + "movie/"+id+"/credits";
        $.get(url,reqParam,function(response){
            var casts = response.cast;
            var allCasts = "";    
            var imageSrc = config.images.base_url + config.images.poster_sizes[3] ;                  
            for(var i=0;i<casts.length;i++){
                allCasts += '<div id="casts" class="col-md-2 col-xs-3">'+
               					
                                '<center><div id="'+casts[i].id+'">'+
                                '<img  class="img-responsive portfolio-item" style="max-height: 150px;" src="'+imageSrc+casts[i].profile_path+'" alt="">'+
                                '</center>'+

                                '<center><h5>'+
                                    '<p style="color:#fff;">' +casts[i].name+ ' <br> as <br>' +casts[i].character+ '</p>'+
                                '</h5></center>'+

                                '<br>' +
                              '</div></div>';
            }
            $("#casts").html(allCasts);
        });


        url = baseUrl + "movie/"+id+"/similar";
        $.get(url,reqParam,function(response){
            var movies = response.results;
            var allMovies = "";
            var imageSrc = config.images.base_url + config.images.poster_sizes[3];            
            for(var i=0;i<movies.length;i++){
                allMovies += '<div id="similar" class="col-sm-3 col-xs-6">'+

                                '<center><h5>'+
                                    '<a style="color:#fff;" href="/view/'+movies[i].id+'">'+movies[i].title+'</a>'+
                                '</h5></center>'+

                                '<center><a href="/view/'+movies[i].id+'">'+
                                    '<img id="movie-image" class="img-responsive portfolio-item" style="max-height: 100px;" src="'+imageSrc+movies[i].backdrop_path+'" alt="">'+
                                '</a></center>'+
                                '<br>' +
                              '</div>';
            }
            $("#similar").html(allMovies);
        });

    });
}
$(document).ready(function(){

    $(".btn-now-showing, .btn-top-rated, .btn-popular, .btn-upcoming").click(function(){
        $(".movie-view").hide();
        $(".movies-list").show();
    });
    initialize(setEventHandlers);
});