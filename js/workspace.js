// 視窗大小改變時...
$(function() {
    $(window).resize(function() {
        var check_colorbox = $('body').hasClass('workspace_resize_on'),
            colorbox_width, colorbox_height;
        if (check_colorbox) {
            if (window.matchMedia('(max-width:600px)').matches) { //手機
                colorbox_width = '95%';
                colorbox_height = '90%';
            } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
                colorbox_width = '80%';
                colorbox_height = '80%';
            } else { //電腦
                colorbox_width = '70%';
                colorbox_height = '70%';
            }
            $.colorbox.resize({
                width: colorbox_width,
                height: colorbox_height
            });
        }
    });
});

/***** START: W-F-C 選項選單 *****/
$(function() {
    // 關閉介面: 管理 Workspace 選項選單
    $('body').on('click', function() {
        if ($('#myWorkspace div.w_engine').hasClass('workspace_manager_area_on')) {
            $('#myWorkspace div.workspace_manager_area_on').removeClass('workspace_manager_area_on').children('div.workspace_manager_area').hide();
        }
    });

    // 關閉介面: 管理 Folder 選項選單
    $('body').on('click', function() {
        if ($('#myWorkspace div.f_engine').hasClass('folders_manager_area_on')) {
            $('#myWorkspace div.folders_manager_area_on').removeClass('folders_manager_area_on').next().hide();
        }
    });

    // 關閉介面: 管理 folder 選項選單 ( 在card介面 右上方 )
    $('body').on('click', function() {
        if ($('#cards_area_manager').hasClass('folders_manager_area_on')) {
            $('#card_wrapper a.folders_manager_area_on').removeClass('folders_manager_area_on').parents('div.cards_area').prev().hide();
        }
    });

    // 關閉 Card 選項選單
    $('body').on('click', function() {
        if ($('#inline_workspace_cards div.workspace_cards_content_inf').hasClass('workspace_cards_content_inf_on')) {
            $('#inline_workspace_cards div.workspace_cards_content_inf_on').removeClass('workspace_cards_content_inf_on').next().hide();
            $('#inline_workspace_cards div.workspace_cards_position').css('z-index', '2');
        }
    });
});

// 顯示介面: 管理 Workspace 選項選單
$(document).on('click', '#myWorkspace div.w_engine', function() {
    ($('#myWorkspace div.workspace_user_name').attr('role') === localStorage.FB_id) ? $('#myWorkspace div.workspace_manager_modifyworkspace').show() : $('#myWorkspace div.workspace_manager_modifyworkspace').hide();
    if (!$(this).hasClass('workspace_manager_area_on')) {
        $(this).addClass('workspace_manager_area_on').children().show();
    }
});

// 顯示介面: 管理 Folder 選項選單
$(document).on('click', '#myWorkspace div.f_engine', function() {
    ($(this).siblings('div.workspace_folders_user').children('div').attr('role') == localStorage.FB_id) ? $('#myWorkspace div.workspace_folders_manager_modifyfolder').show() : $('#myWorkspace div.workspace_folders_manager_modifyfolder').hide();
    if (!$(this).hasClass('folders_manager_area_on')) {
        $(this).addClass('folders_manager_area_on').next().show();
    }
});

// 顯示介面: 管理 folder 選項選單 ( 在 Card 介面 右上方 )
$(document).on('click', '#cards_area_manager', function() {
    ($('a.show_card_on').parent().next().children('div').attr('role') == localStorage.FB_id) ? $('#card_wrapper div.folders_manager_modifyfolder').show() : $('#card_wrapper div.folders_manager_modifyfolder').hide();
    if (!$(this).hasClass('folders_manager_area_on')) {
        $(this).addClass('folders_manager_area_on').parents('div.cards_area').prev().show();
    }
});

// 顯示 Card 選項選單
$(document).on('click', '#inline_workspace_cards div.workspace_cards_content_inf', function() {
    ($(this).parents('div.workspace_cards_position').find('div.workspace_cards_content_user_name').attr('fbid') == localStorage.FB_id) ? $(this).siblings('div.workspace_cards_content_inf_field').find('div:nth-child(4)').show() : $(this).siblings('div.workspace_cards_content_inf_field').find('div:nth-child(4)').hide();
    if (!$(this).hasClass('workspace_cards_content_inf_on')) {
        $(this).addClass('workspace_cards_content_inf_on').parents('div.workspace_cards_position').css('z-index', '10').end().next().show();
        // 暫存工作空間卡片資訊
        var info = $(this).siblings('.workspace_picture');
        var title = $(info).find('.click_workspace_cards').text();
        var url = $(info).find('.click_workspace_cards').attr('href');
        var content = $(info).find('p').text();
        info = {
            title: title,
            url: url,
            content: content
        };
        localStorage.setItem('page_info', JSON.stringify(info));
    } else {
        $('#inline_workspace_cards div.workspace_cards_content_inf_on').removeClass('workspace_cards_content_inf_on').next().hide();
        $('#inline_workspace_cards div.workspace_cards_position').css('z-index', '2');
    }
});
/***** END: W-F-C 選項選單 *****/

/***** START: colorbox function 準備 *****/
// show_addcard() 準備  
$(document).on('click', '#card_wrapper a.addcard', function() {
    $(this).parents('div.folders_manager_area').addClass('show_addcard_ready');
});

// show_modifyfolder() 準備
$(document).on('click', 'a.modifyfolder', function(e) {
    $(this).parents('div.workspace_folders_manager_area').addClass('show_modifyfolder_ready');
    console.log(e.target);
    localStorage.setItem('folder_selected', $(this).parents('div.workspace_four_column').attr('id'));
});

// show_modifycard() 準備
$(document).on('click', 'a.modifycard', function() {
    $(this).parents('div.workspace_cards_content_inf_field').addClass('show_modifycard_ready');
    localStorage.setItem('card_selected', $(this).parents('div.workspace_cards_position').attr('sid'));
});
/***** END: colorbox function 準備 *****/

/**** W-F-C UI ****/
$(function() {
    // 顯示介面: 新增 workspace
    $('#Workspace_nav a.add_workspace, #sharing_with_group a.add_workspace').click(function() {
        var box_width, box_height;
        if (window.matchMedia('(max-width:600px)').matches) { //手機
            box_width = '95%';
            box_height = '90%';
        } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
            box_width = '80%';
            box_height = '80%';
        } else { //電腦
            box_width = '70%';
            box_height = '70%';
        }
        $('a.add_workspace').colorbox({
            inline: true,
            fixed: true,
            width: box_width,
            height: box_height,
            reposition: true,
            transition: 'none',
            title: false,
            onComplete: function() {
                if ($('body').hasClass('sharing_with_group_z')) {
                    $('#cboxOverlay').css('z-index', 100001);
                    $('#colorbox').css('z-index', 100001);
                }
                $('body').addClass('my_add_workspace_on').addClass('workspace_resize_on');
            },
            onClosed: function() {
                if ($('body').hasClass('sharing_with_group_z')) {
                    $('#cboxOverlay').css('z-index', '');
                    $('#colorbox').css('z-index', '');
                }
                $('body').removeClass('my_add_workspace_on').removeClass('workspace_resize_on');
            }
        });
    });

    // *顯示介面: 顯示 Workspace 中所有 Folders
    $('#Workspace_nav').on('click', 'li.w-item > a', function() {
        $('#preloader').find('span').text('請稍後...').end().removeClass('dom_hidden');
        Enter_W(this);
        console.log(this);
        $('#myWorkspace div.workspace_title_inf').children('span').text($(this).text()); // 顯示 workspace 名稱
        $(this).addClass('workspace_on_now');
        $('#myWorkspace').addClass('workspace_on').css({
            marginLeft: '',
            marginRight: ''
        }).removeClass('dom_hidden').attr('style', '');
        $('#wrapper').css({
            marginLeft: '',
            marginRight: ''
        }).addClass('dom_hidden');
        $('#under-footer').css({
            marginLeft: '',
            marginRight: ''
        }).addClass('dom_hidden');
        $('#timeline_wrapper').css({
            marginLeft: '',
            marginRight: ''
        }).addClass('dom_hidden');
    });

    // 離開介面: 離開 Workspace 中所有 Folders
    $('#delete_workspace').click(function() {
        closeWShelper();
    });

    // 顯示介面: 修改 Workspace
    $('#myWorkspace a.modifyworkspace').click(function() {
        var box_width, box_height;
        if (window.matchMedia('(max-width:600px)').matches) { //手機
            box_width = '95%';
            box_height = '90%';
        } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
            box_width = '80%';
            box_height = '80%';
        } else { //電腦
            box_width = '70%';
            box_height = '70%';
        }
        $('a.modifyworkspace').colorbox({
            inline: true,
            fixed: true,
            width: box_width,
            height: box_height,
            reposition: true,
            transition: 'none',
            title: false,
            onComplete: function() {
                $('body').addClass('my_modifyworkspace_on').addClass('workspace_resize_on');
                $('#inline_modifyworkspace_wrapper_comment').val($('div.workspace_comment_inf > span').text());
                $('#inline_modifyworkspace_wrapper_name').val($('div.workspace_title_inf > span').text());
            },
            onClosed: function() {
                $('body').removeClass('my_modifyworkspace_on').removeClass('workspace_resize_on');
            }
        });
    });

    // 顯示介面: 新增 Folder
    $('#myWorkspace a.addfolder, #sharing_with_group a.addfolder').click(function() {
        var box_width, box_height;
        if (window.matchMedia('(max-width:600px)').matches) { //手機
            box_width = '95%';
            box_height = '90%';
        } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
            box_width = '80%';
            box_height = '80%';
        } else { //電腦
            box_width = '70%';
            box_height = '70%';
        }
        $('a.addfolder').colorbox({
            inline: true,
            fixed: true,
            width: box_width,
            height: box_height,
            reposition: true,
            transition: 'none',
            title: false,
            onComplete: function() {
                var a = $('body').hasClass('sharing_with_group_z');
                if (a) {
                    $('#cboxOverlay').css('z-index', 100001);
                    $('#colorbox').css('z-index', 100001);
                }
                $('body').addClass('my_add_folder_on').addClass('workspace_resize_on');
            },
            onClosed: function() {
                var a = $('body').hasClass('sharing_with_group_z');
                if (a) {
                    $('#cboxOverlay').css('z-index', '');
                    $('#colorbox').css('z-index', '');
                }
                $('body').removeClass('my_add_folder_on').removeClass('workspace_resize_on');
            }
        });
    });

    // 顯示介面: 顯示 Folder 中所有 Cards
    $('#myWorkspace').on('click', 'a.workspace_folder_area', function() {
        /* 處理資料 */
        cardsInFolder(this);
        /* 處理介面 */
        $(this).addClass('show_card_on');
        $('#asus_upload').attr('asus_fID', $(this).parents('div.workspace_four_column').attr('id'));
        $('div.cards_area_header_text').text($(this).nextAll('div.workspace_folder_title_inf').find('div.workspace_folder_title_inf_text').text());
        $('div.workspace_cards_folder_comment_inf > span').text($(this).nextAll('div.workspace_folder_comment_inf').find('div.workspace_folder_comment_inf_text').text());
        $('#card_wrapper_background').removeClass('dom_hidden').attr('style', '');
        $('#card_wrapper').removeClass('dom_hidden').attr('style', '');
        $('div.cards_area').removeClass('dom_hidden').attr('style', '');
        $('div.cards_area_header').removeClass('dom_hidden').attr('style', '');
        $('body').attr('tag', 'w');
    });

    // 關閉介面: 離開 Folder 中所有 Cards
    $('#cards_area_leave').click(function() {
        localStorage.removeItem('folder_selected');
        $('#inline_workspace_cards').find('div.workspace_cards_position').remove(); // 清空
        $('#card_wrapper_background').addClass('dom_hidden');
        $('#card_wrapper').addClass('dom_hidden');
        $('div.cards_area').addClass('dom_hidden');
        $('div.cards_area_header').addClass('dom_hidden');
        $('a.show_card_on').removeClass('show_card_on');
        $('div.cards_area_nav').hide();
        $('#inline_workspace_cards').css('top', '42px');
        $('div.workspace_cards_content_selectarea').hide();
        $('div.cards_area_select_icon_click').removeClass('cards_area_select_icon_click');
        $('div.workspace_cards_content_selectarea_icon_select').removeClass('workspace_cards_content_selectarea_icon_select');
    });
});

function cardsInFolder(that) {
    var folderID = that.parentNode.parentNode.id;
    localStorage.setItem("folder_selected", folderID);
    // 取得所有 Card
    $.post("db/w_getCards.php", {
        fid: folderID
    })
        .fail(function(x, e, txt) {
            console.log(txt);
        })
        .done(function(r) {
            console.log(r);
            console.log("成功取得 Card 資料 from " + folderID);
            var data = JSON.parse(r);
            for (var i = 0, item; item = data[i]; i++) {
                showCard(item.cid, item.title, item.content, item.url, item.fbid, item.time, item.is_file);
            }
        });
}

// 關閉介面: 離開 workspace

function closeWShelper() {
    var a = $('body').hasClass('timeline_on');
    if (!a) {
        $('#wrapper').removeClass('dom_hidden').attr('style', '');
        $('#under-footer').removeClass('dom_hidden').attr('style', '');
        $('#myWorkspace').removeClass('workspace_on').addClass('dom_hidden');
        $('div.workspace_on_now').removeClass('workspace_on_now');
    } else {
        $('#timeline_wrapper').removeClass('dom_hidden').attr('style', '');
        $('#myWorkspace').removeClass('workspace_on').addClass('dom_hidden');
        $('div.workspace_on_now').removeClass('workspace_on_now');
        if ($('#timeline_update_temp > div').length != 0) {
            $('#timeline_notificationCountArea').hide();
            $('#timeline_show_update').show(50);
        }
    }
    $('div.noFolder').remove();
    localStorage.removeItem('workspace_selected');
    localStorage.removeItem('folder_selected');
}

// 修改 Folder 介面: 確定修改 Folder
$(document).on('click', '#inline_folders_manager_modifyfolder div.inline_modifyfolder_wrapper_submit > input', function() {
    // 更新 DOM 內容    
    if (!$('a.workspace_folder_area').hasClass('show_card_on')) {
        var $a = $('div.show_modifyfolder_ready').nextAll('div.workspace_folders');
        $a.find('div.workspace_folder_title_inf_text').text($('#inline_modifyfolder_wrapper_name').val());
        $a.find('div.workspace_folder_comment_inf_text').text($('#inline_modifyfolder_wrapper_comment').val());
    } else {
        $('a.show_card_on').nextAll('div.workspace_folder_title_inf').find('div.workspace_folder_title_inf_text').text($('#inline_modifyfolder_wrapper_name').val());
        $('a.show_card_on').nextAll('div.workspace_folder_comment_inf').find('div.workspace_folder_comment_inf_text').text($('#inline_modifyfolder_wrapper_comment').val());
    }
    $('div.cards_area_header_text').text($('#inline_modifyfolder_wrapper_name').val());
    $('div.workspace_cards_folder_comment_inf > span').text($('#inline_modifyfolder_wrapper_comment').val());
    $.colorbox.close();
});

// 修改 Folder 介面: 確定刪除 Folder
$(document).on('click', '#inline_folders_manager_modifyfolder div.inline_modifyfolder_wrapper_delect > input', function() {
    if (!$('a.workspace_folder_area').hasClass('show_card_on')) {
        $('div.show_modifyfolder_ready').parent('div.workspace_four_column').remove();
    } else {
        $('a.show_card_on').parents('div.workspace_four_column').remove();
    }
    $.colorbox.close();
    $('#card_wrapper_background').addClass('dom_hidden');
    $('#card_wrapper').addClass('dom_hidden');
    $('div.cards_area').addClass('dom_hidden');
    $('div.cards_area_header').addClass('dom_hidden');
    $('#inline_modifyfolder_wrapper_comment').val('');
    $('#inline_modifyfolder_wrapper_name').val('');
});

// 修改 Card 介面: 確定刪除 Card
$(document).on('click', '#inline_workspace_cards_position_modifycard div.inline_modifycard_wrapper_delect > input', function() {
    $('#cards_area_leave').removeClass('checkModified');
    var sid = $('div.show_modifycard_ready').parents('div.workspace_cards_position').attr('sid');
    $('[sid=' + sid + ']').remove();
    $.colorbox.close();
    $('#inline_modifycard_wrapper_comment').val('');
    $('#inline_modifycard_wrapper_name').val('');
    $('#inline_modifycard_wrapper_url').val('');
    sid = '';
});

// 顯示介面: 修改 folder

function show_modifyfolder() {
    var box_width, box_height;
    if (window.matchMedia('(max-width:600px)').matches) { //手機
        box_width = '95%';
        box_height = '90%';
    } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
        box_width = '80%';
        box_height = '80%';
    } else { //電腦
        box_width = '70%';
        box_height = '70%';
    }
    $('a.modifyfolder').colorbox({
        inline: true,
        fixed: true,
        width: box_width,
        height: box_height,
        reposition: true,
        transition: 'none',
        title: false,
        onComplete: function() {
            $('body').addClass('my_modifyfolder_on').addClass('workspace_resize_on');
            if (!$('a.workspace_folder_area').hasClass('show_card_on')) {
                var $a = $('div.show_modifyfolder_ready').nextAll('div.workspace_folders');
                $('#inline_modifyfolder_wrapper_comment').val($a.find('div.workspace_folder_comment_inf_text').text());
                $('#inline_modifyfolder_wrapper_name').val($a.find('div.workspace_folder_title_inf_text').text());
            } else {
                $('#inline_modifyfolder_wrapper_comment').val($('a.show_card_on').nextAll('div.workspace_folder_comment_inf').find('div.workspace_folder_comment_inf_text').text());
                $('#inline_modifyfolder_wrapper_name').val($('a.show_card_on').nextAll('div.workspace_folder_title_inf').find('div.workspace_folder_title_inf_text').text());
            }
        },
        onClosed: function() {
            $('body').removeClass('my_modifyfolder_on').removeClass('workspace_resize_on');
            $('div.show_modifyfolder_ready').removeClass('show_modifyfolder_ready');
        }
    });
}

// 顯示介面: 新增 Card

function show_addcard() {
    var box_width, box_height,
        folderID = $(this).parents('div.workspace_four_column').attr('id');
    localStorage.setItem('folder_selected', folderID);
    if (window.matchMedia('(max-width:600px)').matches) { //手機
        box_width = '95%';
        box_height = '90%';
    } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
        box_width = '80%';
        box_height = '80%';
    } else { //電腦
        box_width = '70%';
        box_height = '70%';
    }
    $('a.addcard').colorbox({ // click card adding with color-inline
        inline: true,
        fixed: true,
        width: box_width,
        height: box_height,
        reposition: true,
        transition: 'none',
        title: false,
        onComplete: function() {
            $('body').addClass('my_add_card_on').addClass('workspace_resize_on');
        },
        onClosed: function() {
            $('body').removeClass('my_add_card_on').removeClass('workspace_resize_on');
            $('div.show_addcard_ready').removeClass('show_addcard_ready');
        }
    });
}

// 顯示介面: 修改 Card

function show_modifycard() {
    var box_width, box_height;
    if (window.matchMedia('(max-width:600px)').matches) { //手機
        box_width = '95%';
        box_height = '90%';
    } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
        box_width = '80%';
        box_height = '80%';
    } else { //電腦
        box_width = '70%';
        box_height = '70%';
    }
    $('a.modifycard').colorbox({
        inline: true,
        fixed: true,
        width: box_width,
        height: box_height,
        reposition: true,
        transition: 'none',
        title: false,
        onComplete: function() {
            $('body').addClass('my_modifycard_on').addClass('workspace_resize_on');
            var $a = $('div.show_modifycard_ready').nextAll('div.workspace_picture');
            $('#inline_modifycard_wrapper_comment').val($a.find('p').text());
            $('#inline_modifycard_wrapper_name').val($a.find('h2 > a').text());
            $('#inline_modifycard_wrapper_url').val($a.find('h2 > a').attr('href'));
        },
        onClosed: function() {
            $('body').removeClass('my_modifycard_on').removeClass('workspace_resize_on');
            $('div.show_modifycard_ready').removeClass('show_modifycard_ready');
        }
    });
}

/******************************
 *
 *		連結資料庫專區 #CONNECT
 *
 ******************************/

// 點擊進入 workspace 後 , 顯示所有 folder

function Enter_W(e) {
    var id = $(e).attr('wid'); // 取得 wID
    console.log('選中:' + id);
    localStorage.setItem('workspace_selected', id);

    if (id) {
        $('div.workspace_four_column').remove(); // 清空之前的項目
        var data = JSON.parse(localStorage.group_data || '{}');
        data = data[localStorage.group_selected];
        data = data.workspaces || '';
        // 取得 workspace 資料
        if (data) {
            // 取得選中 workspace
            for (var i = 0, item; item = data[i]; i++) {
                if (item.w_id === id) {
                    $('div.workspace_comment_inf span').text(item.w_comment);
                    $('div.workspace_user div').attr('role', item.creatorID).text(item.creatorID);
                    $('div.workspace_user span[role=time]').text(item.createdTime);
                    // 取得此 workspace 所有 folder
                    if (item.folders) {
                        $('div.noFolder').remove();
                        for (var j = 0, folder; folder = item.folders[j]; j++)
                            foldersInWS(folder.f_id, folder.f_name, folder.f_comment, folder.createdTime, folder.creatorID);
                    } else {
                        if ($('div.noFolder'))
                            $('div.workspace_user').after('<div class="noFolder">目前還沒有任何資料夾</div>');
                    }
                    $('#preloader').addClass('dom_hidden');

                    break;
                }
            }

        }
    }
}

// 顯示 folder 於 workspace 介面

function foldersInWS(fid, name, comment, time, creator) {
    // 新增 folder 調整參數
    if (typeof time === 'undefined' || time === null) time = '0000-00-00 00:00:00';
    if (typeof creator === 'undefined' || creator === null) creator = localStorage.FB_id;

    // folder 時間戳
    var a = nowTime().split(" ");
    Time = (time == '0000-00-00 00:00:00') ? a[1] : time;

    $('div.workspace_user').after(
        '<div class="workspace_four_column" id="' + fid + '" sid="' + a[0] + '">' +
        '<div class="workspace_folders_title">&nbsp;</div>' +
        '<div class="workspace_folders_title_icon f_engine" title="管理 folder"></div>' +
        '<div class="workspace_folders_manager_area">' +
        '<div class="workspace_folders_manager_addcard">' +
        '<a class="co_a addcard" href="#inline_folders_manager_addcard" onclick="show_addcard()">&nbsp;</a>' +
        '<div class="workspace_folders_manager_addcard_icon"></div>' +
        '<div class="workspace_folders_manager_addcard_text">新增 Card</div>' +
        '</div>' +
        '<div class="workspace_folders_manager_modifyfolder">' +
        '<a class="co_a modifyfolder" href="#inline_folders_manager_modifyfolder" onclick="show_modifyfolder()">&nbsp;</a>' +
        '<div class="workspace_folders_manager_modifyfolder_icon"></div>' +
        '<div class="workspace_folders_manager_modifyfolder_text">修改 Folder</div>' +
        '</div>' +
        '</div>' +
        '<div class="workspace_folders">' +
        '<a class="co_a workspace_folder_area" href="javascript: void(0);">&nbsp;</a>' +
        '<div class="workspace_folder_title_inf">' +
        '<div class="workspace_folder_title_inf_text">' + name + '</div>' +
        '</div>' +
        '<div class="workspace_folder_comment_inf">' +
        '<div class="workspace_folder_comment_inf_text">' + comment + '</div>' +
        '</div>' +
        '</div>' +
        '<div class="workspace_folders_user">' +
        '<div class="workspace_folders_user_name" role="' + creator + '">' + getName(creator) +
        '</div>' +
        '<span> 創建於 </span>' +
        '<span role="time">' + Time + '</span>' +
        '</div>' +
        '</div>'
    );
}

// 新增 Workspace 介面: 確定新增 Workspace
$(document).on('click', '#inline_workspace div.inline_workspace_wrapper_submit > input', newWorkspace);

function newWorkspace() {
    var name = $('#inline_workspace_wrapper_name').val();
    var comment = $('#inline_workspace_wrapper_comment').val();

    if (name) {

        // 建立 workspace 並取得 wID
        var id = addWorkspace(name, comment);

        // 新增到 DOM
        var item = '' +
            '<li class="w-item" id="' + id + '">' +
            '<a class="co_a" title="' + name + '" wid="' + id + '">' + name + '</a>' +
            '</li>';
        $('#Workspace_nav').prepend(item);

        // 直接新增到群組共享上
        if ($('#sharing_with_group').hasClass('sharing_with_group_on')) {
            var field = '' +
                '<div class="sharing_with_group_select_field" style="display: block;"></div>' +
                '<div class="_select_workspace" data="' + id + '" style="">' + name + '</div>';
            $('div.sharing_with_group_select').append(field);
        }

        // WS 時間戳
        var a = nowTime().split(" ");
        $('div.workspace_user_name').attr('role', localStorage.FB_id).text(localStorage.FB_name);
        $('div.workspace_user').find('span[role=time]').text(a[1]);
        $('div.workspace').attr('sid', a[0]);
        $('div.workspace_comment_inf > span').text(comment);

        // 關閉介面 , 清空數據
        $.colorbox.close();
        $('#inline_workspace_wrapper_comment').val('');
        $('#inline_workspace_wrapper_name').val('');

    } else {
        alert("請輸入 Workspace 名稱!");
    }
}

// 新增 workspace 到資料庫

function addWorkspace(name, comment) {
    var wID = "w" + createID();
    var gID = localStorage.group_selected;
    // 傳送到資料庫
    $.post("db/w_setWorkspace.php", {
        gid: gID,
        wid: wID,
        wname: name,
        comment: comment,
        fbid: localStorage.FB_id
    })
        .fail(function(e) {
            console.log(e);
        })
        .done(function(r) {
            console.log(r);

        });
    return wID;
}

// 修改 Workspace 介面: 確定修改 Workspace
$(document).on('click', '#inline_workspace_manager_modifyworkspace div.inline_modifyworkspace_wrapper_submit > input', editWorkspace);

function editWorkspace() {
    // 修改的資訊
    var name = $('#inline_modifyworkspace_wrapper_name').val();
    var comment = $('#inline_modifyworkspace_wrapper_comment').val();

    // 更新資料庫所需
    var wid = localStorage.workspace_selected;
    var gid = localStorage.group_selected;

    // 傳送到資料庫
    $.post("db/w_setWorkspace.php", {
        gid: gID,
        wid: wID,
        wname: name,
        comment: comment,
        fbid: localStorage.FB_id
    })
        .fail(function(e) {
            console.log(e);
        })
        .done(function(r) {
            console.log(r);
            // console.log('editWorkspace: T_savedata');
            // if (localStorage.T_savedataTimeout) {
            // 	window.setTimeout(function () {
            // 		var a = window.setTimeout(function () {
            // 			T_savedata('none', 'none', wid, 'none');
            // 		}, 1000);
            // 		localStorage.setItem('T_savedataTimeout', a);
            // 	}, 3000);
            // } else {
            // 	var a = window.setTimeout(function () {
            // 		T_savedata('none', 'none', wid, 'none');
            // 	}, 1000);
            // 	localStorage.setItem('T_savedataTimeout', a);
            // }
        });

    // 更新 顯示 內容
    $('div.workspace_title_inf > span').text(name);
    $('div.workspace_comment_inf > span').text(comment);
    $('div.workspace_on_now > div').text(name);

    // 關閉介面 , 清空數據
    $.colorbox.close();
    $('#inline_modifyworkspace_wrapper_comment').val('');
    $('#inline_modifyworkspace_wrapper_name').val('');
}

// 修改 Workspace 介面: 確定刪除 Workspace
$(document).on('click', '#inline_workspace_manager_modifyworkspace div.inline_modifyworkspace_wrapper_delect > input', function() {
    /* 後端處理 */
    removeById(localStorage.workspace_selected);
    localStorage.removeItem('workspace_selected');
    /* 介面處理 */
    $('div.workspace_title_inf > span').text('');
    $('div.workspace_comment_inf > span').text('');
    $('div.workspace_on_now').remove();
    $.colorbox.close();
    $('#inline_modifyworkspace_wrapper_comment').val('');
    $('#inline_modifyworkspace_wrapper_name').val('');
    if (!$('body').hasClass('timeline_on')) {
        $('#wrapper').removeClass('dom_hidden').attr('style', '');
        $('#under-footer').removeClass('dom_hidden').attr('style', '');
        $('#myWorkspace').removeClass('workspace_on').addClass('dom_hidden');
        $('div.workspace_on_now').removeClass('workspace_on_now');
    } else {
        $('#timeline_wrapper').removeClass('dom_hidden').attr('style', '');
        $('#myWorkspace').removeClass('workspace_on').addClass('dom_hidden');
        $('div.workspace_on_now').removeClass('workspace_on_now');
    }
    $('div.workspace_four_column').remove();
    $('div.workspace_cards_position').remove();
});

// 顯示群組所有 Workspaces
$(document).on('click', 'div.nav_main_w', function() {
    var data = JSON.parse(localStorage.group_data || '{}'),
        timestamp = new Date(data.timestamp || 0),
        now = new Date(),
        groupID = localStorage.group_selected,
        old = $('li.w-item');
    if (groupID && data) {
        // 初次更新
        if (old.length === 0) {
            updateWorkspace(data[groupID]);
        }
        // 有新資料時更新
        if (timestamp > now) {
            old.remove();
            updateWorkspace(data[groupID]);
        }
    }
});

function updateWorkspace(data) {
    var workspaces = data.workspaces,
        div = '';

    if (workspaces) {
        for (var i = workspaces.length - 1; i >= 0; i--) {
            div += '<li class="w-item" id="' + workspaces[i].w_id + '"> <a class="co_a" wid="' + workspaces[i].w_id + '">' + workspaces[i].w_name + '</a>';
        }
        $('#Workspace_nav').prepend(div);
    } else {
        console.log("BUG");
    }
}

// 新增 Folder 介面: 確定新增 Folder
$(document).on('click', '#inline_workspace_manager_addfolder div.inline_folder_wrapper_submit > input', newFolder);

function newFolder() {
    $('div.noFolder').remove();
    var name = $('#inline_folder_wrapper_name').val();
    var comment = $('#inline_folder_wrapper_comment').val();

    if (name) {
        var id = addFolder(name, comment),
            test = $('#sharing_with_group').hasClass('sharing_with_group_on');

        // 新增到 群組共享 or WS介面
        test ? addToSharing(id, name) : foldersInWS(id, name, comment);

        $.colorbox.close();
        $('#inline_folder_wrapper_comment').val('');
        $('#inline_folder_wrapper_name').val('');
    } else {
        alert("請輸入 Folder 名稱!");
    }
}

// 新增 folder 到資料庫

function addFolder(name, comment) {
    var folderID = "f" + createID();
    var wID = localStorage.workspace_selected;
    // 傳送到資料庫
    $.post("db/w_setFolder.php", {
        wid: wID,
        fid: folderID,
        fname: name,
        comment: comment,
        fbid: localStorage.FB_id
    })
        .fail(function(x) {
            console.log(x.responseText);
        })
        .done(function(r) {
            console.log(r);
            // if (localStorage.T_savedataTimeout) {
            // 	window.setTimeout(function () {
            // 		var a = window.setTimeout(function () {
            // 			T_savedata('none', 'none', folderID, 'none');
            // 		}, 1000);
            // 		localStorage.setItem('T_savedataTimeout', a);
            // 	}, 3000);
            // } else {
            // 	var a = window.setTimeout(function () {
            // 		T_savedata('none', 'none', folderID, 'none');
            // 	}, 1000);
            // 	localStorage.setItem('T_savedataTimeout', a);
            // }
        });
    return folderID;
}

// 顯示 folder 於 workspace 介面

function foldersInWS(fid, name, comment, time, creator) {

    // 新增 folder 調整參數
    if (typeof time === 'undefined' || time === null) time = '0000-00-00 00:00:00';
    if (typeof creator === 'undefined' || creator === null) creator = localStorage.FB_id;

    // folder 時間戳
    var a = nowTime().split(" ");
    Time = (time == '0000-00-00 00:00:00') ? a[1] : time;

    $('div.workspace_user').after(
        '<div class="workspace_four_column" id="' + fid + '" sid="' + a[0] + '">' +
        '<div class="workspace_folders_title">&nbsp;</div>' +
        '<div class="workspace_folders_title_icon f_engine" title="管理 folder"></div>' +
        '<div class="workspace_folders_manager_area">' +
        '<div class="workspace_folders_manager_addcard">' +
        '<a class="co_a addcard" href="#inline_folders_manager_addcard" onclick="show_addcard()">&nbsp;</a>' +
        '<div class="workspace_folders_manager_addcard_icon"></div>' +
        '<div class="workspace_folders_manager_addcard_text">新增 Card</div>' +
        '</div>' +
        '<div class="workspace_folders_manager_modifyfolder">' +
        '<a class="co_a modifyfolder" href="#inline_folders_manager_modifyfolder" onclick="show_modifyfolder()">&nbsp;</a>' +
        '<div class="workspace_folders_manager_modifyfolder_icon"></div>' +
        '<div class="workspace_folders_manager_modifyfolder_text">修改 Folder</div>' +
        '</div>' +
        '</div>' +
        '<div class="workspace_folders">' +
        '<a class="co_a workspace_folder_area" href="javascript: void(0);">&nbsp;</a>' +
        '<div class="workspace_folder_title_inf">' +
        '<div class="workspace_folder_title_inf_text">' + name + '</div>' +
        '</div>' +
        '<div class="workspace_folder_comment_inf">' +
        '<div class="workspace_folder_comment_inf_text">' + comment + '</div>' +
        '</div>' +
        '</div>' +
        '<div class="workspace_folders_user">' +
        '<div class="workspace_folders_user_name" role="' + creator + '">' + getName(creator) +
        '</div>' +
        '<span> 創建於 </span>' +
        '<span role="time">' + Time + '</span>' +
        '</div>' +
        '</div>'
    );
}

// 顯示於群組共享

function addToSharing(id, name) {
    var folder = '' +
        '<div class="_select_folder" style="display: block;">' +
        '<div class="_select_folder_area" data="' + id + '" style="">' + name + '</div>' +
        '</div>';
    $('div._select_workspace_on').after(folder);
    $('div.sharing_with_group_addworkspace').hide();
}

// 修改 Folder 介面: 確定修改 Folder
$(document).on('click', '#inline_folders_manager_modifyfolder div.inline_modifyfolder_wrapper_submit > input', editFolder);

function editFolder() {
    var name = $('#inline_modifyfolder_wrapper_name').val();
    var comment = $('#inline_modifyfolder_wrapper_comment').val();
    var wid = localStorage.workspace_selected;
    var fid = localStorage.folder_selected;

    // 傳送到資料庫
    $.post("db/w_setFolder.php", {
        wid: wid,
        fid: fid,
        fname: name,
        comment: comment,
    })
        .fail(function(x, e, txt) {
            console.log(txt);
        })
        .done(function(r) {
            console.log(r);
            // console.log('editFolder: T_savedata');
            // if (localStorage.T_savedataTimeout) {
            // 	window.setTimeout(function () {
            // 		var a = window.setTimeout(function () {
            // 			T_savedata('none', 'none', fid, 'none');
            // 		}, 1000);
            // 		localStorage.setItem('T_savedataTimeout', a);
            // 	}, 3000);
            // } else {
            // 	var a = window.setTimeout(function () {
            // 		T_savedata('none', 'none', fid, 'none');
            // 	}, 1000);
            // 	localStorage.setItem('T_savedataTimeout', a);
            // }
            $('#inline_modifyfolder_wrapper_comment').val('');
            $('#inline_modifyfolder_wrapper_name').val('');
        });
}

// 刪除 Folder 介面: 確定刪除 Folder
$(document).on('click', '#inline_folders_manager_modifyfolder div.inline_modifyfolder_wrapper_delect > input', function() {
    removeById(localStorage.folder_selected);
    localStorage.removeItem('folder_selected');
    if ($('div.workspace_four_column').length === 0) {
        $('div.workspace_user').after('<div class="noFolder">目前還沒有任何資料夾</div>');
    }
});

// 顯示所有 Cards

function showCard(cid, title, content, url, id, t, is_file) {
    // 設定參數
    var fbid = id;
    var fbname = '無資料';
    if (fbid == '') fbid = '100005642921358';
    else fbname = getName(id);
    var time = (time == '0000-00-00 00:00:00' || time == '') ? time = '------' : t;
    var displayLink = (url.substr(0, 5) == 'https') ? url.substr(8) : (url.substr(0, 4) == 'http') ? url.substr(7) : url;
    if (parseInt(is_file) == 0) {
        // 新增到 Folder 介面
        $('div.workspace_cards_folder_comment_inf').after(
            '<div sid="' + cid + '" class="workspace_cards_position">' +
            '<div class="workspace_cards_content_user isotope-item">' +
            '<div class="workspace_cards_content_user_icon">' +
            '<img src="https://graph.facebook.com/' + fbid + '/picture" width="38px">' +
            '</div>' +
            '<div class="workspace_cards_content_area">' +
            '<div class="workspace_cards_content_user_name" fbid="' + fbid + '">' + fbname + '</div>' +
            '<span>-</span>' +
            '<span class="workspace_cards_content_time">' + time + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="workspace_cards_content isotope-item">' +
            '<div class="workspace_cards_content_selectarea" title="選擇">' +
            '<div class="workspace_cards_content_selectarea_icon"></div>' +
            '</div>' +
            '<div class="workspace_cards_content_inf" title="選項選單"></div>' +
            '<div class="workspace_cards_content_inf_field">' +
            '<div class="workspace_cards_content_inf_field_content" title="群組共享">' +
            '<div class="post_group">&nbsp;</div>' +
            '<div class="post_group_text">群組共享</div>' +
            '</div>' +
            '<div class="workspace_cards_content_inf_field_content" title="加到標籤">' +
            '<a class="co_a AddToTag" href="#inline_AddToTag" onclick="show_AddToTag()">&nbsp;</a>' +
            '<div class="post_tag">&nbsp;</div>' +
            '<div class="post_tag_text">加到標籤</div>' +
            '</div>' +
            '<div class="workspace_cards_content_inf_field_content" title="分享">' +
            '<div class="post_share">&nbsp;</div>' +
            '<div class="post_share_text">分享</div>' +
            '</div>' +
            '<div class="workspace_cards_content_inf_field_content" title="修改 Card">' +
            '<a class="co_a modifycard" href="#inline_workspace_cards_position_modifycard" onclick="show_modifycard()" >&nbsp;</a>' +
            '<div class="post_modifycard">&nbsp;</div>' +
            '<div class="post_modifycard_text">修改 Card</div>' +
            '</div>' +
            '</div>' +
            '<div class="workspace_picture" title="entry_topic">' +
            '<div class="show_workspace_cards_content item-description">' +
            '<h2 class="co_h2">' +
            '<a class="co_a click_workspace_cards" href="' + url +
            '" onclick="show_cardcontain()" target="_blank">' + title +
            '</a>' +
            '</h2>' +
            '<p>' + content + '</p>' +
            '<div class="post_url">' +
            '<span>' + displayLink + '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );
    }
}

// 新增 Card 介面: 確定新增 Card
$(document).on('click', '#inline_folders_manager_addcard div.inline_card_wrapper_submit > input', newCard);

function newCard() {
    var fID = localStorage.folder_selected,
        name = $('#inline_card_wrapper_name').val(),
        content = $('#inline_card_wrapper_comment').val(),
        url = $('#inline_card_wrapper_url').val();

    if (name && url) {

        // 參數設定
        var displayLink = (url.substr(0, 5) == 'https') ? url.substr(8) : (url.substr(0, 4) == 'http') ? url.substr(7) : url;
        var cID = "c" + createID();
        var time = getNow();

        // 若是在 folder 介面中新增
        if ($('#card_wrapper').css('display') == 'block') {

            // 新增到 Card 介面
            $('div.workspace_cards_folder_comment_inf').after(
                '<div sid="' + cID + '" class="workspace_cards_position">' +
                '<div class="workspace_cards_content_user isotope-item">' +
                '<div class="workspace_cards_content_user_icon">' +
                '<img src="https://graph.facebook.com/' + localStorage.getItem('FB_id') + '/picture" width="38px">' +
                '</div>' +
                '<div class="workspace_cards_content_area">' +
                '<div class="workspace_cards_content_user_name" fbid="' + localStorage.getItem('FB_id') + '">' + localStorage.getItem('FB_name') + '</div>' +
                '<span>-</span>' +
                '<span class="workspace_cards_content_time">' + time + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="workspace_cards_content isotope-item">' +
                '<div class="workspace_cards_content_selectarea" title="選擇">' +
                '<div class="workspace_cards_content_selectarea_icon"></div>' +
                '</div>' +
                '<div class="workspace_cards_content_inf" title="選項選單"></div>' +
                '<div class="workspace_cards_content_inf_field">' +
                '<div class="workspace_cards_content_inf_field_content" title="群組共享">' +
                '<div class="post_group">&nbsp;</div>' +
                '<div class="post_group_text">群組共享</div>' +
                '</div>' +
                '<div class="workspace_cards_content_inf_field_content" title="加到標籤">' +
                '<a class="co_a AddToTag" href="#inline_AddToTag" onclick="show_AddToTag()">&nbsp;</a>' +
                '<div class="post_tag">&nbsp;</div>' +
                '<div class="post_tag_text">加到標籤</div>' +
                '</div>' +
                '<div class="workspace_cards_content_inf_field_content" title="分享">' +
                '<div class="post_share">&nbsp;</div>' +
                '<div class="post_share_text">分享</div>' +
                '</div>' +
                '<div class="workspace_cards_content_inf_field_content" title="修改 Card">' +
                '<a class="co_a modifycard" href="#inline_workspace_cards_position_modifycard" onclick="show_modifycard()" >&nbsp;</a>' +
                '<div class="post_modifycard">&nbsp;</div>' +
                '<div class="post_modifycard_text">修改 Card</div>' +
                '</div>' +
                '</div>' +
                '<div class="workspace_picture" title="entry_topic">' +
                '<div class="show_workspace_cards_content">' +
                '<h2 class="co_h2">' +
                '<a class="co_a click_workspace_cards" href="' + url +
                '" onclick="show_cardcontain()" target="_blank">' + name +
                '</a>' +
                '</h2>' +
                '<p>' + content + '</p>' +
                '<div class="post_url">' +
                '<span>' + displayLink + '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
            );
        }

        // 傳送到資料庫
        sendCard(cID, fID, name, content, url, time, localStorage.FB_id);

        // 關閉介面: 新增 Card
        $.colorbox.close();
        $('#inline_card_wrapper_url').val('');
        $('#inline_card_wrapper_comment').val('');
        $('#inline_card_wrapper_name').val('');
    } else {
        alert("請輸入\"名稱\"以及\"網址\"後再按\"確定\"!");
    }
}

// 修改 Card 介面: 確定修改 Card
$(document).on('click', '#inline_workspace_cards_position_modifycard div.inline_modifycard_wrapper_submit > input', editCard);

function editCard() {
    // 取得修改資訊
    var name = $('#inline_modifycard_wrapper_name').val();
    var content = $('#inline_modifycard_wrapper_comment').val();
    var url = $('#inline_modifycard_wrapper_url').val();
    var fID = localStorage.folder_selected;
    var cID = localStorage.card_selected;
    var time = getNow();

    // 傳送資料
    sendCard(cID, fID, name, content, url, time);

    // 修改 DOM
    var card = $('div[sid="' + cID + '"]');
    $('#inline_workspace_cards > [sid=' + cID + ']')
        .find('p').text(content)
        .end()
        .find('h2 > a').text(name)
        .end()
        .find('h2 > a').attr('href', url)
        .end()
        .find('.post_url').children('span').text(url)
        .end()
        .find('span.workspace_cards_content_time').html(time);

    // 結束編輯
    $.colorbox.close();
    localStorage.removeItem('card_selected');
    $('#inline_modifycard_wrapper_comment').val('');
    $('#inline_modifycard_wrapper_name').val('');
    $('#inline_modifycard_wrapper_url').val('');
}

// 傳送單個 Card 資料

function sendCard(cid, fid, title, content, url, time, fbid) {
    var data = {
        cid: cid,
        fid: fid,
        title: title,
        content: content,
        url: url,
        time: time
    };

    if (fbid) {
        data.fbid = fbid;
    }

    $.post("db/w_setCard.php", data)
        .fail(function(x, e, txt) {
            console.log(txt);
        })
        .done(function(r) {
            console.log(r);
            // console.log('sendCard: T_savedata');
            // if (localStorage.T_savedataTimeout) {
            // 	window.setTimeout(function () {
            // 		var a = window.setTimeout(function () {
            // 			T_savedata('none', 'none', cid, 'none');
            // 		}, 1000);
            // 		localStorage.setItem('T_savedataTimeout', a);
            // 	}, 3000);
            // } else {
            // 	var a = window.setTimeout(function () {
            // 		T_savedata('none', 'none', cid, 'none');
            // 	}, 1000);
            // 	localStorage.setItem('T_savedataTimeout', a);
            // }
            // return r.substr(0, 19); // 回傳資料庫內的時間
        });
}

// 刪除 Card 介面: 確定刪除 Card
$(document).on('click', '#inline_workspace_cards_position_modifycard div.inline_modifycard_wrapper_delect > input', function() {
    removeById(localStorage.card_selected);
});

// 移除 workspace / folder / card

function removeById(xid) {
    $.post("db/w_removeById.php", {
        xid: xid
    })
        .fail(function(x, e, txt) {
            console.log(txt);
        })
        .done(function(r) {
            console.log(r);
            // console.log('removeById: T_savedata');
            // if (localStorage.T_savedataTimeout) {
            // 	window.setTimeout(function () {
            // 		var a = window.setTimeout(function () {
            // 			T_savedata(xid, 'none', 'none', 'none');
            // 		}, 1000);
            // 		localStorage.setItem('T_savedataTimeout', a);
            // 	}, 3000);
            // } else {
            // 	var a = window.setTimeout(function () {
            // 		T_savedata(xid, 'none', 'none', 'none');
            // 	}, 1000);
            // 	localStorage.setItem('T_savedataTimeout', a);
            // }
        });
}

// 設定頁面在哪

function SetPage() {
    console.log('SetPage');
    if (localStorage.where == 'titlelink_aa') {
        localStorage.setItem('where', 'titlelink_a');
    } else {
        localStorage.setItem('where', 'IndexPage');
        $(document).off('click', SetPage);
    }
}

// 點擊卡片標題: 顯示 Card 內容
$(document).on('click', 'a.click_workspace_cards', function show_cardcontain() {
    if (localStorage.where == 'titlelink_a') {
        localStorage.setItem('where', 'titlelink_aa');
    } else {
        localStorage.setItem('where', 'titlelink_a');
    }
    console.log('show_cardcontain ' + localStorage.where);
    $(document).on('click', SetPage);
});

// 取得創立時間戳

function nowTime() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    var time = d.getFullYear() + (month < 10 ? '0' : '') + month + (day < 10 ? '0' : '') + day + '_' + (hour < 10 ? '0' : '') + hour + (minute < 10 ? '0' : '') + minute + (second < 10 ? '0' : '') + second;
    var now_time = d.getFullYear() + '/' + (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute + ':' + (second < 10 ? '0' : '') + second;
    return time + ' ' + now_time;
}

function createID() {
    return new Date().getTime();
}

function getNow() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    var time = d.getFullYear() + '/' + (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute + ':' + (second < 10 ? '0' : '') + second;
    return time;
}

// 按下 Enter 自動 Submit
$(function() {
    // 新增 Workspace
    $('#inline_workspace_wrapper_name, #inline_workspace_wrapper_comment').keydown(function(event) {
        if (event.keyCode == 13 && $('#inline_workspace_wrapper_name').val() != '') {
            newWorkspace();
        }
    });

    // 新增 Folder
    $('#inline_folder_wrapper_name, #inline_folder_wrapper_comment').keydown(function(event) {
        if (event.keyCode == 13 && $('#inline_folder_wrapper_name').val() != '') {
            newFolder();
        }
    });

    // 新增 Card
    $('#inline_card_wrapper_name, #inline_card_wrapper_comment, #inline_card_wrapper_url').keydown(function(event) {
        if (event.keyCode == 13 && $('#inline_card_wrapper_name').val() != '' && $('#inline_card_wrapper_url').val() != '') {
            newCard();
        }
    });

    // 修改 Workspace
    $('#inline_modifyworkspace_wrapper_name, #inline_modifyworkspace_wrapper_comment').keydown(function(event) {
        if (event.keyCode == 13 && $('#inline_modifyworkspace_wrapper_name').val() != '') {
            editWorkspace();
        }
    });

    // 修改 Folder
    $('#inline_modifyfolder_wrapper_name, #inline_modifyfolder_wrapper_comment').keydown(function(event) {
        if (event.keyCode == 13 && $('#inline_modifyfolder_wrapper_name').val() != '') {
            editFolder();
        }
    });

    // 修改 Card
    $('#inline_modifycard_wrapper_name, #inline_modifycard_wrapper_comment, #inline_modifycard_wrapper_url').keydown(function(event) {
        if (event.keyCode == 13 && $('#inline_modifycard_wrapper_name').val() != '' && $('#inline_modifycard_wrapper_url').val() != '') {
            editCard();
        }
    });
});
