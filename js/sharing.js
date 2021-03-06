// Close UI
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
    // $('#usertags').val('');
    delete localStorage.folder_selected;
}
$(document).on('click', '#sharing_with_group div.leave', close_sharing);

// Store page info when clicking on search result card
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

// Click on folder to select
$(document).on('click', '#sharing_with_group div.sharing_with_group_select_field > div._select_workspace', function () {
    if (!$(this).hasClass('_select_workspace_on')) {
            $(this).parent().siblings().children().removeClass('_select_workspace_on');
            $(this).addClass('_select_workspace_on');
            localStorage.setItem('folder_selected', $('._select_workspace_on').attr('data'));
    }
});

// Show UI
function showSharing() {
    if (localStorage.group_selected) {
        showWS();
        $(this).addClass('this_sharing_with_group_on');
        $('#sharing_with_group').addClass('sharing_with_group_on').removeClass('dom_hidden').attr('style', '');
        $('body').css('overflow', 'hidden');
        $('#sharing_with_group_background').removeClass('dom_hidden').attr('style', '');
    } else {
        alertify.alert('選擇群組後才能使用「群組共享」功能');
    }
}
$(document).on('click', '#portfolio_wrapper1 div.search_result_inf_field_content:nth-child(1)', showSharing);
$(document).on('click', '#inline_workspace_cards div.workspace_cards_content_inf_field_content:nth-child(1)', showSharing);

// Submit
$(document).on('click', '#sharing_with_group div.submit', function() {
    var fID = $('._select_workspace_on').attr('data'),
        tags = $('#usertags').val();
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
        if (tags) tags.split(',').forEach(function(tag, index){
            data.tags = data.tags || [];
            var name = tag.trim();
            if (name) data.tags.push({ name: name, tid: 't' + (createID() + index) });
        });
        sendCard(data, true).success(function(r){
            console.log(r);
            localStorage.removeItem('page_info');
            getGroupUpdated();
            close_sharing();
        })
        .fail(function(err){
            console.log(err);
        });
    } else {
        alertify.alert('請選擇 Folder !');
    }
});

// Data binding
function showWS() {
    var data = processGroupData().folders;
    var $sharing = $('#sharing_with_group').find('div.sharing_with_group_select').remove().end();
    if (data) {
        // 加入新截取資料
        var div = '<div class="sharing_with_group_select">';
        data.forEach(function(folder){
            div += '<div class="sharing_with_group_select_field">'
                + '<div class="_select_workspace'
                + (folder.f_name === '未分類' ? ' _select_workspace_on' : '')
                + '" data="' + folder.f_id + '" style="">' + folder.f_name + '</div>'
                + '</div>';
        });
        div += '<div class="sharing-addfolder"><div class="_select_workspace" style="color: white; font-size: 30px; background: -webkit-linear-gradient(bottom,#006BDC,rgb(61, 126, 255)) no-repeat; background: -moz-linear-gradient(bottom,#006BDC,rgb(61, 126, 255)) no-repeat; background: -o-linear-gradient(bottom,#006BDC,rgb(61, 126, 255)) no-repeat; filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#006BDC, endColorstr=rgb(61, 126, 255) no-repeat); -ms-filter: progid:DXImageTransform.Microsoft.gradient (GradientType=0, startColorstr=#006BDC, endColorstr=rgb(61, 126, 255) no-repeat);"><a class="co_a addfolder" href="#inline_workspace_manager_addfolder" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;">&nbsp;</a>+</div></div>';
		div += '</div>';
        $sharing.find('.sharing_with_group_wrapper').append(div);
		// re-bind click event of showAddFolder box
		$sharing.find('a.addfolder').click( showAddFolder );
        // 卡片檢視界面: 隱藏所在 folder
        if ($('#card_wrapper').css('display') === 'block') {
            $('div._select_folder_area[data=' + localStorage.folder_selected + ']').hide();
        }
    }
}
