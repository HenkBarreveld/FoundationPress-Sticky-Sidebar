/*!
 * Sticky Sidebar v1.2
 *
 * Sticky Sidebar for FoundationPress
 * http://urbino.nl/fpdemo-ss
 *
 * Copyright (c) 2015 Henk Barreveld
 * Released under the MIT license (see the LICENSE file)
 */
$(document).ready(function () {
    "use strict";
    var row = $('section[role="document"]>.row'),
        rowTop,
        content,
        contentHeight,
        sidebar,
        sidebarTop,
        sidebarLeft,
        sidebarHeight,
        sidebarWidth,
        sidebarSticky,
        layoutBroken;

    function sidebarPos() {                 // function called on window resize, window scroll and sidebar click
        if (!sidebarSticky) {               // case: no sidebar or row with class="sidebar-nostick"
            return;
        }
        sidebar.removeClass('fixed');
        sidebar.removeAttr('style');
        sidebarHeight = sidebar.outerHeight(true);
        if (layoutBroken || (contentHeight < sidebarHeight)) {
            return;                         // case: sidebar below/above content or sidebar longer than content
        }
        var topbarBottom = $('.top-bar-container')[0].getBoundingClientRect().top + $('.top-bar-container').outerHeight(true);
        topbarBottom = Math.round(Math.max(topbarBottom, 0));
        rowTop = Math.round(row.offset().top - $(window).scrollTop());
        if (rowTop >= topbarBottom) {         
            return;                         // row top is on the page and below the topbar
        }
        sidebar.addClass('fixed');
        var footerDistance = $('#footer-container').offset().top - $(window).scrollTop() - topbarBottom - sidebarHeight;
        sidebarTop = topbarBottom + ((footerDistance < 0) ? footerDistance : 0);
               // avoid sidebar overlapping footer, if viewport height is maller than sidebar height
        sidebar.css({'position': 'fixed', 'top': sidebarTop, 'left': sidebarLeft, 'width': sidebarWidth});
    }

    function sidebarInf() {                // function called on window load and window resize
        if (!sidebarSticky) {              // case: no sidebar or row with class="sidebar-nostick"
            return;
        }
        contentHeight = content.outerHeight(true);
        sidebar.removeAttr('style');
        sidebarWidth = sidebar.css('width');
        sidebarTop = sidebar.offset().top;
        sidebarLeft = sidebar.offset().left;
        layoutBroken = (sidebarTop !== content.offset().top);       //  sidebar not next to content but underneath (or above)
        sidebarPos();
    }

    sidebarSticky = (row.children('aside').length > 0) &&           // exlude pages with no sidebar
        !(row.hasClass('sidebar-nostick'));                         // exclude pages with <div class="row sidebar-nostick">
    
    if (sidebarSticky) {
        content = row.children('div').first();
        sidebar = row.children('aside').first();
    }

    sidebarInf();
    
    // on window scroll, reposition the sidebar
    $(window).scroll(sidebarPos);
    
    // on window resize, reposition the sidebar
    $(window).resize(sidebarInf);
    
    // on sidebar click, possibly changing the sidebar height, reposition the sidebar
    // Repositioning is delayed, to deal with any animation in the sidebar height change
    sidebar.click(function () {
        setTimeout(function () {
            sidebarPos();
        }, '400');
    });
    
    // debugging: on ESC press, make one or more alerts
    $(window).keypress(function(event) {
        var key = event.keyCode;
        if (event.keyCode == 27) {
            alert("topbarBottom: " + $('.top-bar-container')[0].getBoundingClientRect().top + $('.top-bar-container').outerHeight(true));
            alert("rowTop: " + rowTop);
        }
    });
});
