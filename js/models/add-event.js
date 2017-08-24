$(document).ready(function() {
    // add and preview image
    function filePreview(input) {
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                let file = e.target;
                $("<span class=\"pip\">" +
                    "<img class=\"mainImg\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>" +
                    "<span class=\"remove\">Delete</span>" +
                    "</span>").insertAfter("#file");
                $(".remove").click(function(){
                    $(this).parent(".pip").remove();
                });
            };
            reader.readAsDataURL(input.files[0]);
        }
        $('#images').css("margin-top", 240);
    }

    $("#file").change(function () {
        filePreview(this);
    });

    // load images into html
    let margin = 140;
    if (window.File && window.FileList && window.FileReader) {
        $("#files").on("change", function(e) {
            let files = e.target.files,
                filesLength = files.length;
            for (let i = 0; i < filesLength; i++) {
                let f = files[i];
                let fileReader = new FileReader();
                fileReader.onload = (function(e) {
                    let file = e.target;
                    $("<span class=\"pip\">" +
                        "<img class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>" +
                        "<span class=\"remove\">Delete/Change</span>" +
                        "</span>").insertAfter("#files");
                    $(".remove").click(function(){
                        $(this).parent(".pip").remove();
                    });

                    let imageThumbCount = $('.imageThumb').length;

                    if (imageThumbCount % 3 === 0) {
                        margin += 140;
                    }
                    $('#submitBtn').css('margin-top', margin);

                });
                fileReader.readAsDataURL(f);
            }
        });
    } else {
        alert("Your browser not allowed this file format!")
    }
});

