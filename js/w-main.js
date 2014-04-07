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

// 顯示於群組共享

function addToSharing(id, name) {
    var folder = '' +
        '<div class="_select_folder" style="display: block;">' +
        '<div class="_select_folder_area" data="' + id + '" style="">' + name + '</div>' +
        '</div>';
    $('div._select_workspace_on').after(folder);
    $('div.sharing_with_group_addworkspace').hide();
}

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
            getGroupUpdated();
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

// 取得指定ID的名字

function getName(id) {
    var data = JSON.parse(localStorage.group_members || '{}'),
        found; // the name found
    data.every(function(obj) {
        if (obj.id === id) {
            found = obj.name;
            return false;
        } else
            return true;
    });
    if (found)
        return found;
    else
        return 'unknown';
}

function processGroupData() {
    var data = JSON.parse(localStorage.group_data || '{}');
    return data[localStorage.group_selected] || {};
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
