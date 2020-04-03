function refresh_calendar(calendar_id) {
    $("span[data-date][data-id='" + calendar_id + "']").each(function() {
        $(this).removeClass().addClass("calendar_blocked");
        let busy = false;
        let title = [];
        let link = "";
        let date = $(this).data("date");
        $.each(calendars[calendar_id], function( index, value ) {
            if ((date>=value[0]) && (date<=value[1])) {
                link = value[3];
                title.push(value[2]);
            }
            busy = busy || ((date>=value[0]) && (date<=value[1]));
        });
        if ((busy) && (date >= current_date))  {
            $(this).addClass("busy");
            $(this).html('<a href="/' + link + '" title="' + title.join('; ') + '">' + $(this).html() + '</a>');
        }
        if ((busy) && (date < current_date))  {
            $(this).addClass("old_busy");
            $(this).html('<a href="/' + link + '" title="' + title.join('; ') + '">' + $(this).html() + '</a>');
        }
    });
}

function select_date() {
    return false;
}