function close_sharing() {
    $('.this_sharing_with_group_on').removeClass('this_sharing_with_group_on');
    $('.this_tag_sharing_with_group_on').removeClass('this_tag_sharing_with_group_on');
    $('#sharing_with_group').removeClass('sharing_with_group_on').addClass('dom_hidden');
	$('body').css('overflow', '');
    $('#sharing_with_group_background').addClass('dom_hidden');
    $('.sharing_with_group_select_field').show().css('border', '');
    $('#sharing_with_group div._select_workspace').removeClass('_select_workspace_on');
    $('._select_card_on').hide();
    $('#sharing_with_group div._select_folder').hide();
    $('.sharing_with_group_back').hide();
    $('._select_card_on').css({
        'background-color': '',
        'color': ''
    });
    $('._select_folder_area').css({
        'background-color': '',
        'color': ''
    });
    $('._select_card').removeClass('_select_card_on');
    $('._select_folder_area').removeClass('_select_folder_on');
    if ($('body').hasClass('sharing_with_group_z')) {
        $('#sharing_with_group').css('z-index', '');
        $('#sharing_with_group_background').css('z-index', '');
        $('.sharing_with_group_z').removeClass('sharing_with_group_z');
    }
    delete localStorage.folder_selected;
}

// 顯示介面: 群組共享 ( Workspace )
$(document).on('click', '#share_with_group', function() {
    $(this).addClass('this_sharing_with_group_on');
    $('#sharing_with_group').addClass('sharing_with_group_on').removeClass('dom_hidden').css({
        top: '',
        left: ''
    });
    $('#sharing_with_group_background').removeClass('dom_hidden').css({
        top: '',
        left: ''
    });
    showWS();
});

// 群組共享介面： 返回 選擇 workspace
$(document).on('click', '#sharing_with_group div.sharing_with_group_back', function() {
    $('.sharing_with_group_select_field').css('border', '').show();
    $('#sharing_with_group div._select_workspace').removeClass('_select_workspace_on');
    $('._select_card_on').hide();
    $('#sharing_with_group div._select_folder').hide();
    $(this).hide();
    $('._select_card_on').css({
        'background-color': '',
        'color': ''
    });
    $('._select_folder_area').css({
        'background-color': '',
        'color': ''
    }).removeClass('_select_folder_on');
    $('._select_card').removeClass('_select_card_on');
    $('#sharing_with_group div.sharing_with_group_addfolder').hide();
    $('#sharing_with_group div.sharing_with_group_addworkspace').show();
});
// 關閉 群組共享介面
$(document).on('click', '#sharing_with_group div.leave', close_sharing);

// 點擊搜尋結果，儲存該項資訊
$(document).on('click', 'h2 .fancy_iframe', function() {
    var title = $(this).html();
    var content = $(this).parent().siblings('p').html();
    var url = $(this).attr('href');
    var pageInfo = {
        title: title,
        content: content,
        url: url
    };
    localStorage.setItem('page_info', JSON.stringify(pageInfo));
});

// 群組共享介面： 選擇 workspace
$(document).on('click', '#sharing_with_group div._select_workspace', function () {
    if (!$(this).hasClass('_select_workspace_on')) {
            $(this).parent().siblings().children().removeClass('_select_workspace_on');
            $(this).addClass('_select_workspace_on');
            localStorage.setItem('folder_selected', $('._select_workspace_on').attr('data'));
    }
});

// 群組共享介面： 選擇 folder
$(document).on('click', '#sharing_with_group div._select_folder_area', function() {
    if (!$(this).hasClass('_select_folder_on')) {
        $(this).addClass('_select_folder_on');
        $(this).css('background-color', 'rgba(6, 82, 231, 0.870588)');
        $(this).css('color', 'rgb(245, 255, 0)');
        $('._select_workspace_on').nextAll('._select_folder').has('._select_folder_area:not(._select_folder_on)').hide();
        $(this).nextAll('._select_card').show(100);
    }
});

// 顯示群組共享介面 (at 搜尋結果)
$(document).on('click', '#portfolio_wrapper1 div.search_result_inf_field_content:nth-child(1)', function() {
    if (localStorage.group_selected) {
        showWS();
        $(this).addClass('this_sharing_with_group_on');
        $('#sharing_with_group').addClass('sharing_with_group_on').removeClass('dom_hidden').attr('style', '');
		$('body').css('overflow', 'hidden');
        $('#sharing_with_group_background').removeClass('dom_hidden').attr('style', '');
    } else {
        alert('選擇群組後才能使用「群組共享」功能');
    }
});

// 確認 群組共享
$(document).on('click', '#sharing_with_group div.submit', function() {
    var fID = $('._select_workspace_on').attr('data');
    if (fID) {
        var cID = 'c' + createID();
        var page_info = JSON.parse(localStorage.page_info);
        var data = {
            cid: cID,
            fid: fID,
            title: page_info.title,
            content: page_info.content,
            url: page_info.url,
            time: getNow()
        };
        sendCard(data, true).success(function(r){
            console.log(r);
            localStorage.removeItem('page_info');
            close_sharing();
        });
    } else {
        alert('請選擇 Folder !');
    }
});

// 顯示 folders
function showWS() {
    var data = processGroupData().folders;
    console.log(data);
    var $sharing = $('#sharing_with_group').find('div.sharing_with_group_select').remove().end();
    if (data) {
        // 加入新截取資料
        var div = '<div class="sharing_with_group_select">';
        data.forEach(function(folder){
            div += '<div class="sharing_with_group_select_field" style="display: block;">'
                + '<div class="_select_workspace'
                + (folder.f_name === '未分類' ? ' _select_workspace_on' : '')
                + '" data="' + folder.f_id + '" style="">' + folder.f_name + '</div>'
                + '</div>';
        });
        div += '</div>';
        $sharing.find('.sharing_with_group_wrapper').append(div);
        // 卡片檢視界面: 隱藏所在 folder
        if ($('#card_wrapper').css('display') === 'block') {
            $('div._select_folder_area[data=' + localStorage.folder_selected + ']').hide();
        }
    }
}
