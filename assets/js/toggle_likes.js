// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }


    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount);
                if (data.data.deleted == true){
                    likesCount -= 1;
                    
                }else{
                    likesCount += 1;
                }


                $(self).attr('data-likes', likesCount);
                $(self).html(`${likesCount} Likes`);

                if($(self).attr('toggle-like')=='false'){
                    $(self).attr('toggle-like','true');
                    $(self).css({
                        color:"blue"
                    })
                }
                else{
                    $(self).attr('toggle-like','false');
                    $(self).css({
                        color:"#909090"
                    })
                }

            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            

        });
    }
}
