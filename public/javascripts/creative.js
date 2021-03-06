$(".items-list").on("click", "[class^='delete']", function () {
    var thiss = $(this);
    $.ajax({
        url: "/files/" + this.id,
        type: 'delete',
        success: function (res) {
            console.log(res);
            if (res !== "OK") {
                alert("Error deleting");
                return;
            }
            $.ajax({
                url: "/files-list",
                type: 'GET',
                success: function (res) {
                    $(".items-list").html(res);
                }
            });
        }
    });
});


$(document).ready(function () {
    $('.files-list').selectable({
        filter: " > li",
        cancel: ".ui-splitselect-item .ui-splitselect-handle-drag",
        selecting: function (event, ui) {
            $(ui.selecting).addClass('active');
        },
        unselecting: function (event, ui) {
            $(ui.unselecting).removeClass('active');
        },
        selected: function (event, ui) {
            $(ui.selected).addClass('active');
            var result = $( "#result" ).empty();
            $(".active", this).each(function () {
                var index = $(".files-list li").index(this);
                result.append( " #" + ( index + 1 ) +this);
            });
        },
        unselected: function (event, ui) {
            $(ui.unselected).removeClass('active');
        }
    });
    $('#uploadForm').submit(function () {
        $("#browsefilename").empty().text("File is uploading...");
        $(this).ajaxSubmit({

            beforeSend: function () {
                var percentVal = '0%';
                $('.progress-bar').width(percentVal);
            },
            uploadProgress: function (event, position, total, percentComplete) {
                var percentVal = percentComplete + '%';
                $('.progress-bar').width(percentVal);
            },

            error: function (xhr) {
                console.log('Error: ' + xhr.status);
            },

            success: function (response) {
                $("#status").empty().text(response);
                console.log(response);
                if (response !== "OK") {
                    alert("Error uploading");
                    $("#browsefilename").empty().text();
                    return;
                }
                $.ajax({
                    url: "/files-list",
                    type: 'GET',
                    success: function (res) {
                        $(".items-list").html(res);
                    }
                });

                $("#browsefilename").empty().text('File Uploaded!');
            }
        });
        return false;
    });
});

$('#filebrowser').change(function () {
    //$('#title').val(this.value ? this.value.match(/([\w-_]+)(?=\.)/)[0] : '');
    $('#browsefilename').text(this.files[0].name);
    $('#filenameinput').val(this.files[0].name);

})