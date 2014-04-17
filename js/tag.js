$(function() {
    // getTagData(); // 頁面載入完成 , 取得 Tag 資料

    $('body').attr('tag', 's');
    $(window).resize(function() { // 視窗改變時觸發
        var a = $('body').hasClass('show_tags_click');
        if (a) {
            if (window.matchMedia('(max-width:600px)').matches) { //手機
                var colorbox_width = '95%';
                var colorbox_height = '90%';
            } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
                var colorbox_width = '80%';
                var colorbox_height = '80%';
            } else { //電腦
                var colorbox_width = '70%';
                var colorbox_height = '70%';
            }
            $.colorbox.resize({
                width: colorbox_width,
                height: colorbox_height
            });
        }
        var b = $('body').hasClass('tag_box_on'); //colorbox 開啟時...
        if (b) {
            if (window.matchMedia('(max-width:600px)').matches) { //手機
                var colorbox_width = '95%';
                var colorbox_height = '90%';
            } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
                var colorbox_width = '80%';
                var colorbox_height = '80%';
            } else { //電腦
                var colorbox_width = '70%';
                var colorbox_height = '70%';
            }
            $.colorbox.resize({
                width: colorbox_width,
                height: colorbox_height
            });
        }
    });
    $('#leave_tag').click(function() { //離開 我的標籤介面
        $('div.tag_on').removeClass('tag_on');
        $('body').attr('tag', 's').css('overflow-y', '');
        $('#tag_wrapper_background').addClass('dom_hidden');
        $('#tag_wrapper').addClass('dom_hidden');
        $('#tag_wrapper div.tag_area').addClass('dom_hidden');
        $('#tag_wrapper div.tag_header').addClass('dom_hidden');
    });
    $('#showtag').click(function() { //顯示 我的標籤介面
        $('body').css('overflow-y', 'hidden').addClass('tag_on').attr('tag', 't');
        $('#tag_wrapper_background').removeClass('dom_hidden').attr('style', '');
        $('#tag_wrapper').removeClass('dom_hidden').attr('style', '');
        $('#tag_wrapper div.tag_area').removeClass('dom_hidden').attr('style', '');
        $('#tag_wrapper div.tag_header').removeClass('dom_hidden').attr('style', '');
        $('#slider_btn').removeClass('bar_on');
        $('#slider_background').attr('style', '').addClass('dom_hidden');
        $('#Sidebar > div.mySidebar_container_up').addClass('dom_hidden');
        $('#Sidebar > div.mySidebar_container_down').addClass('dom_hidden');
        $('#wrapper').css({
            marginLeft: '',
            marginRight: ''
        });
        $('#timeline_wrapper').css({
            marginLeft: '',
            marginRight: ''
        });
        $('#myWorkspace').css({
            marginLeft: '',
            marginRight: ''
        });
        $('#fiexd-header').css({
            marginLeft: '',
            marginRight: ''
        });
        $('#nav').css({
            marginLeft: '',
            marginRight: ''
        });
        $('#nav_bg').css({
            marginLeft: '',
            marginRight: ''
        });
        $('#under-footer').css({
            marginLeft: '',
            marginRight: ''
        });
        $('#scroll-top-top').css({
            marginLeft: '',
            marginRight: ''
        });
        $('#Group_Board').css({
            marginLeft: '',
            marginRight: ''
        });
        $('#Sidebar').addClass('dom_hidden');
    });
    $('div').on('click', function() { //關閉 管理標籤選單
        if ($('#show_manager_tags').hasClass('show_manager_tags_on')) {
            $('.show_manager_tags_on').removeClass('show_manager_tags_on').parents('div.tag_area').prev('div.tag_manager').addClass('dom_hidden');
            $('div.tag_manager');
        }
        if ($('div.tag_content_inf').hasClass('tag_content_inf_on')) { // 我的標籤介面：關閉 管理card選單
            $('div.tag_content_inf_on').removeClass('tag_content_inf_on').next('div.tag_content_inf_field').hide();
            $('div.tag_content').css('z-index', '151');
        }
        if ($('#_action').hasClass('show_manager_tags_on')) {
            $('.show_manager_tags_on').removeClass('show_manager_tags_on').parents('#fiexd_header').next('div.tag_manager').addClass('dom_hidden');
        }
    });
    $('a.show_tags').on('click', function() { //顯示 所有的 tags 介面
        if (window.matchMedia('(max-width:600px)').matches) { //手機
            var box_width = '95%';
            var box_height = '90%';
        } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
            var box_width = '80%';
            var box_height = '80%';
        } else { //電腦
            var box_width = '70%';
            var box_height = '70%';
        }
        $('a.show_tags').colorbox({
            inline: true,
            fixed: true,
            width: box_width,
            height: box_height,
            reposition: true,
            transition: 'none',
            title: false,
            onComplete: function() {
                $('body').addClass('show_tags_click');
            },
            onClosed: function() {
                $('.show_tags_click').removeClass('show_tags_click');
            }
        });
    });
    $('#inline_tag_manager_addtag div.inline_addtag_wrapper_submit > input').click(function() { //確定 新增 tag
        var b = new Array();
        b = tag_getTime().split(' ');
        //判斷顏色是否用過
        var used = $('#inline_all_tags').children('div.all_tags_inf').length;
        for (var i = 0; i < used; i++) {
            var d = $('#inline_all_tags > div.all_tags_inf:nth-child(' + (i + 2) + ')');
        }
        var temp = 0;
        var c = 0; //CheckColor(a);
        if ((c === 0 && temp === 0) || used === 0) { //只考慮底色 色調、濃度、亮度皆小於187 的並且顏色未使用過
            if ($('#inline_addtag_wrapper_name').val()) { //判斷是否輸入名稱
                // 插入DOM
                $('#inline_all_tags').children('.all_tags_ShowAll').after(
                    '<div class="all_tags_inf" t_sid="' + b[0] + '" t_name="' + $('#inline_addtag_wrapper_name').val() + '">' +
                    '<div class="all_tags_inf_ModifyTag_area">' +
                    '<a class="co_a all_tags_inf_ModifyTag" href="#inline_all_tags_inf_ModifyTag">&nbsp;</a>' +
                    '</div>' +
                    '<div class="all_tags_inf_icon"></div>' +
                    '<div class="all_tags_inf_text">' + $('#inline_addtag_wrapper_name').val() + '</div>' +
                    '</div>'
                );
                $.fancybox.close();
                newTag(b[0]);
            } else {
                alert('請輸入名稱');
            }
        } else {
            alert('Tag顏色不得重覆');
        }
    });
    $('a.all_tags_inf_ModifyTag').fancybox({
        'width': (function() {
            if (window.matchMedia('(max-width:600px)').matches) { //手機
                var fancybox_width = '100%';
            } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
                var fancybox_width = '85%';
            } else { //電腦
                var fancybox_width = '75%';
            }
            return fancybox_width;
        })(),
        'height': (function() {
            if (window.matchMedia('(max-width:600px)').matches) { //手機
                var fancybox_height = '100%';
            } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
                var fancybox_height = '90%';
            } else { //電腦
                var fancybox_height = '80%';
            }
            return fancybox_height;
        })(),
        'autoScale': false,
        'autoSize': false,
        'transitionIn': 'none',
        'transitionOut': 'none',
        'type': 'inline',
        openEffect: 'none',
        closeEffect: 'none',
        afterShow: function() {},
        afterClose: function() {
            $('.tag_modify_on').removeClass('tag_modify_on');
            $('#colorbox').show();
            $('#cboxOverlay').show();
        }
    });
    $('a.addtag').on('click', function() { //顯示 新增 tag 介面
        if (window.matchMedia('(max-width:600px)').matches) { //手機
            var fancybox_width = '100%';
            var fancybox_height = '100%';
        } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
            var fancybox_width = '85%';
            var fancybox_height = '90%';
        } else { //電腦
            var fancybox_width = '75%';
            var fancybox_height = '80%';
        }
        $('a.addtag').fancybox({
            'width': fancybox_width,
            'height': fancybox_height,
            'autoScale': false,
            'autoSize': false,
            'transitionIn': 'none',
            'transitionOut': 'none',
            'type': 'inline',
            openEffect: 'none',
            closeEffect: 'none',
            onUpdate: function() {
                $.fancybox.update();
            },
            afterShow: function() {
                $('#cboxOverlay').hide();
                $('#colorbox').hide();
                $('body').addClass('addtag_on');
            },
            afterClose: function() {
                var a = $('body').hasClass('AddToTag_on');
                $('.addtag_on').removeClass('addtag_on');
                if (a) {
                    //再判斷一次是否有新的 tag
                    $('#inline_AddToTag_wrapper_name > option').remove();
                    var a = $('#inline_all_tags').children('div.all_tags_inf').length;
                    var b = '';
                    for (var i = 0; i < a; i++) {
                        var $c = $('#inline_all_tags > div.all_tags_inf:nth-child(' + (i + 2) + ')');
                        b += '<option t_sid="' + $c.attr('t_sid') + '" t_name="' + $c.attr('t_name') + '" tid="' + $c.attr('tid') + '">' + $c.attr('t_name') + '</option>'
                    }
                    $('#inline_AddToTag_wrapper_name').append(b);
                    $('#cboxOverlay').show();
                    $('#colorbox').show();
                }
            }
        });
    });
    $('#inline_all_tags_inf_ModifyTag div.inline_ModifyTag_wrapper_submit > input').click(function() { //確定 修改 tag
        if ($('#inline_ModifyTag_wrapper_name').val()) { //判斷是否輸入名稱
            var l = new Array(); // 建立新的 t_sid
            l = tag_getTime().split(' ');
            var m = $('#inline_ModifyTag_wrapper_name').attr('t_sid'); // 舊的 t_sid
            $('div.all_tags_inf[t_sid=' + m + ']')
                .attr('t_name', $('#inline_ModifyTag_wrapper_name').val())
                .children('.all_tags_inf_text').text($('#inline_ModifyTag_wrapper_name').val());
            edit_tag();
            var a = $('div.tag_container').children('div.tag').length;
            for (var i = 0; i < a; i++) {
                var b = $('div.tag_container > div.tag:nth-child(' + (i + 1 + 1) + ')');
                var c = new Array();
                c = b.attr('t_sid').split(' ');
                var e = new Array();
                e = b.attr('t_name').split(' ');
                for (var j = 0; j < c.length; j++) { // 判斷要修改的資訊在陣列的的第幾個元素
                    if (m == c[j]) {
                        var f = j; // 找到要修改的地方
                        break;
                    } else {
                        var f = -1;
                    }
                }
                if (f >= 0) { //沒找到要修改的地方 則不執行修改
                    var g = '';
                    var k = ''; //重新組合陣列，除了要刪除的資訊之外
                    for (var j = 0; j < c.length; j++) {
                        if (j != f) {
                            g += ' ' + c[j];
                            k += ' ' + e[j];
                        } else {
                            g += ' ' + l[0];
                            k += ' ' + $('#inline_ModifyTag_wrapper_name').val();
                        }
                    }
                    //.substr(1) 刪除第一個空白
                    b.attr('t_sid', g.substr(1));
                    b.attr('t_name', k.substr(1));
                    //修改card內容
                    b.find('div.tag_content_tagname > span:nth-child(' + (f + 1) + ')')
                        .attr('t_sid', l[0])
                        .text($('#inline_ModifyTag_wrapper_name').val());
                    b.find('div.tag_content_color:nth-child(' + (f + 1 + 1) + ')');
                }
            }
            $('div.all_tags_inf[t_sid=' + m + ']').attr('t_sid', l[0]);
            $.fancybox.close();
        } else {
            alert('請輸入名稱');
        }
    });
    $('#inline_all_tags_inf_ModifyTag div.inline_ModifyTag_wrapper_remove > input').click(function() { //確定 移除 tag

        var h = $('#inline_ModifyTag_wrapper_name').attr('t_sid');
        deleteTag($('div.all_tags_inf[t_sid=' + h + ']').attr('tid'));
        $('div.all_tags_inf[t_sid=' + h + ']').remove();


        var k = $('div.tag_container').children('div.tag').length;
        for (var i = 0; i < k; i++) {
            var l = $('div.tag_container > div.tag:nth-child(' + (i + 1 + 1) + ')');
            var a = new Array();
			console.log(l.attr('t_sid'));
            a = l.attr('t_sid').split(' ');
            var c = new Array();
            c = l.attr('t_name').split(' ');
            for (var j = 0; j < a.length; j++) { //判斷要刪除的資訊在陣列的的第幾個元素
                if (l.find('div.tag_content_tagname > span[t_sid=' + h + ']').attr('t_sid') == a[j]) {
                    var d = j;
                    break;
                } else {
                    var d = -1; //沒找到
                }
            }
            if (d >= 0) { //有找到要刪除的資訊才執行
                if (a.length > 1) { //判斷card被加上的標籤個數
                    var e = '';
                    var g = ''; //重新組合陣列，除了要刪除的資訊之外
                    for (var j = 0; j < a.length; j++) {
                        if (j != d) {
                            e += ' ' + a[j];
                            g += ' ' + c[j];
                        }
                    }
                    //.substr(1) 刪除第一個空白
                    l.attr('t_sid', e.substr(1));
                    l.attr('t_name', g.substr(1));
                    //刪除要刪除的資訊
                    l.find('div.tag_content_tagname > span[t_sid=' + h + ']').remove();
                } else { //標籤個數為 1 ，將這張 card 移出我的標籤區
                    l.remove();
                }
            }
        }
        $.fancybox.close();
    });
    /* 暫時拿掉此項功能
	$('.inline_tags_modifycard_wrapper_submit > input').click(function(){    //確定 修改 card in my tags
		var sid = $('.show_tags_modifycard_ready').parents('div.tag').attr('sid');
		var Link = $('#inline_tags_modifycard_wrapper_url').val();
		var temp = Link.indexOf("://") + 3;
		if( temp == 2 )  var displayLink = Link;
			else  var displayLink = Link.substring( temp );
		$('div.tag_container').children('[sid='+sid+']').find('p').text( $('#inline_tags_modifycard_wrapper_comment').val() )
			.end()
				.find('h2 > a').text( $('#inline_tags_modifycard_wrapper_name').val() ).attr('href', Link)
			.end()
				.find('.post_url').children('span').text( displayLink );
		$.colorbox.close();
		$('#inline_tags_modifycard_wrapper_comment').val('');
		$('#inline_tags_modifycard_wrapper_name').val('');
		$('#inline_tags_modifycard_wrapper_url').val('');
		Link = '';
		sid = '';
	});
	$('.inline_tags_modifycard_wrapper_remove > input').click(function(){    //確定 移除 card in my tags
		var sid = $('.show_tags_modifycard_ready').parents('div.tag').attr('sid');
		$('[sid='+sid+']').remove();
		$.colorbox.close();
		$('#inline_modifycard_wrapper_comment').val('');
		$('#inline_modifycard_wrapper_name').val('');
		$('#inline_modifycard_wrapper_url').val('');
		sid = '';
	});
	*/
});
$(document).on('click', '#show_manager_tags', function() { // 顯示 管理標籤選單  
    if (!$(this).hasClass('show_manager_tags_on')) {
        $(this).addClass('show_manager_tags_on').parents('div.tag_area').prev('div.tag_manager').removeClass('dom_hidden');
        $('div.tag_manager').attr('style', '');
    }
});
$(document).on('click', '#tag_wrapper div.tag_content_inf', function() { // 我的標籤介面：顯示 管理card選單  
    var test = $(this).hasClass('folders_manager_area_on');
    if (!$(this).hasClass('tag_content_inf_on')) {
        $(this).addClass('tag_content_inf_on').parent('div.tag_content').css('z-index', '152').end().next('div.tag_content_inf_field').show();
        // 暫存此標籤卡片資訊
        var info = $(this).siblings('.tag_content_area');
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
        $('div.tag_content_inf_on').removeClass('tag_content_inf_on').next('div.tag_content_inf_field').hide();
        $('div.tag_content').css('z-index', '151');
    }
});
$(document).on('click', '#inline_AddToTag div.inline_AddToTag_wrapper_submit > input', function() { // 確定加上 Tag
    switch ($('body').attr('tag')) {
        case 's':
            search_AddToTag(); //確定加上 Tag： 一般情況
            break;
        case 'w':
            workspace_AddToTag(); //確定加上 Tag： 打開工作空間時
            break;
        case 't':
            tag_AddToTag(); //確定加上 Tag： 打開我的標籤時
            break;
        default:
            break;
    }
});
$(document).on('click', '#inline_all_tags a.all_tags_inf_ModifyTag', function() { // 在所有的 tags 介面  點擊 修改 tag
    $(this).addClass('tag_modify_on');
    $('body').addClass('tag_modify_on');
    $('#colorbox').hide();
    $('#cboxOverlay').hide();
    $('#inline_ModifyTag_wrapper_name')
        .val($(this).parents('div.all_tags_inf').attr('t_name'))
        .attr('t_sid', $(this).parents('div.all_tags_inf').attr('t_sid'))
        .attr('t_name', $(this).parents('div.all_tags_inf').attr('t_name'));
});
$(document).on('click', '#inline_all_tags div.all_tags_inf', function() { // 在所有的 tags 介面  選擇 tag
    var test = $('body').hasClass('tag_modify_on');
    if (!test) {
        var a = $('div.tag_container > div.tag').length;
        $('div.tag').addClass('dom_hidden');
        for (var i = 0; i < a; i++) {
            var b = new Array();
            b = $('div.tag_container > div.tag:nth-child(' + (i + 1 + 1) + ')').attr('t_sid').split(' ');
            for (var j = 0; j < b.length; j++) {
                if (b[j] == $(this).attr('t_sid')) {
                    $('div.tag[t_sid="' + $('div.tag_container > div.tag:nth-child(' + (i + 1 + 1) + ')').attr('t_sid') + '"]').removeClass('dom_hidden');
                    break;
                }
            }
        }
        $('div.tag_container')
            .attr('tag_sid', $(this).attr('t_sid'))
            .attr('tag_name', $(this).attr('t_name'));
        $('#tag_container_CurrentTag').text($(this).attr('t_name')).removeClass('dom_hidden');
        $.colorbox.close();
    }
});
$(document).on('click', '#inline_all_tags div.all_tags_ShowAll', function() { // 在所有的 tags 介面  選擇 顯示所有 tag
    $('div.tag').removeClass('dom_hidden');
    $('div.tag_container').attr('tag_sid', '').attr('tag_color', '').attr('tag_name', '');
    $('#tag_container_CurrentTag').addClass('dom_hidden').css('color', '#444').text('');
    $.colorbox.close();
});
$(document).on('click', '#portfolio_wrapper1 div.search_result_inf_field > .search_result_inf_field_content:nth-child(2)', function() { // 顯示加上標籤
    $(this).parent('.search_result_inf_field').addClass('this_search_on');
});
$(document).on('click', '#inline_workspace_cards div.workspace_cards_content_inf_field > .workspace_cards_content_inf_field_content:nth-child(2)', function() { // 顯示加上標籤
    $(this).parent('.workspace_cards_content_inf_field').addClass('this_workspace_on');
});
$(document).on('click', '#tag_wrapper div.tag_content_inf_field > div.tag_content_inf_field_content:nth-child(2)', function() { // 顯示加上標籤
    $(this).parent('div.tag_content_inf_field').addClass('this_tag_on');
});
$(document).on('click', '#tag_wrapper div.tag_content_tagname > span', function() { // 點擊 標籤卡片上方標籤: 移除標籤
    delete_card(this);
    var $a = $(this).parents('div.tag');
    var a = new Array();
    a = $a.attr('t_sid').split(' ');
    var c = new Array();
    c = $a.attr('t_name').split(' ');
    if (a.length > 1) { // 判斷被加上的標籤個數
        for (var i = 0; i < a.length; i++) { // 判斷要刪除的資訊在陣列的的第幾個元素
            if ($(this).attr('t_sid') == a[i]) {
                var d = i;
                break;
            }
        }
        var e = '';
        var g = ''; // 重新組合陣列，除了要刪除的資訊之外
        for (var i = 0; i < a.length; i++) {
            if (i != d) {
                e += ' ' + a[i];
                g += ' ' + c[i];
            }
        }
        //.substr(1) 刪除第一個空白
        $a.attr('t_sid', e.substr(1)).attr('t_name', g.substr(1));// 刪除要刪除的資訊
        if ($('div.tag_container').attr('tag_sid') == $(this).attr('t_sid')) $a.addClass('dom_hidden');
        $(this).remove();
    } else { // 標籤個數為 1 ，將這張 card 移出我的標籤區
        $a.remove();
    }
});
/* 修改標籤卡片功能暫時拿掉
$(document).on('click', 'div.tags_modifycard', function(){    // show_tags_modifycard() 準備    
	$(this).parents('div.tag_content_inf_field').addClass('show_tags_modifycard_ready');
});
*/
$(document).on('click', '#tag_wrapper div.tag_content_inf_field > div.tag_content_inf_field_content:nth-child(1)', function() { // 點擊標籤卡片: 顯示 群組共享
    $(this).addClass('this_tag_sharing_with_group_on');
    /* this_tag_sharing_with_group_on -> 代表在我的標籤介面上的群組共享 */
    /* $('.this_sharing_with_group_on').hasClass('this_tag_sharing_with_group_on'); */
    /* 可以用以上方法判斷是否在 我的標籤介面上的群組共享 */
    $(this).addClass('this_sharing_with_group_on');
    $('#sharing_with_group').addClass('sharing_with_group_on').removeClass('dom_hidden').css({
        'left': '',
        'top': ''
    });
    $('#sharing_with_group_background').removeClass('dom_hidden').css({
        'left': '',
        'top': ''
    });
});

function show_AddToTag() { //顯示 加上 Tag 介面
    $('#inline_AddToTag_wrapper_name > option').remove();
    var a = $('#inline_all_tags').children('div.all_tags_inf').length;
    var b = '';
    for (var i = 0; i < a; i++) {
        var $c = $('#inline_all_tags > div.all_tags_inf:nth-child(' + (i + 2) + ')');
        b += '<option t_sid="' + $c.attr('t_sid') + '" t_name="' + $c.attr('t_name') + '" tid="' + $c.attr('tid') + '">' + $c.attr('t_name') + '</option>'
    }
    $('#inline_AddToTag_wrapper_name').append(b);
    if (window.matchMedia('(max-width:600px)').matches) { //手機
        var box_width = '95%';
        var box_height = '90%';
    } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
        var box_width = '80%';
        var box_height = '80%';
    } else { //電腦
        var box_width = '70%';
        var box_height = '70%';
    }
    $('.AddToTag').colorbox({
        inline: true,
        fixed: true,
        width: box_width,
        height: box_height,
        reposition: true,
        transition: 'none',
        title: false,
        onComplete: function() {
            $('body').addClass('tag_box_on');
            $('body').addClass('AddToTag_on');
        },
        onClosed: function() {
            $('div.tag_box_on').removeClass('tag_box_on');
            $('.AddToTag_on').removeClass('AddToTag_on');
            $('.this_search_on').removeClass('this_search_on');
            $('div.this_workspace_on').removeClass('this_workspace_on');
            $('.this_tag_on').removeClass('this_tag_on');
        }
    });
}

function search_AddToTag() { //確定加上 Tag： 一般情況
    var a = $('#inline_AddToTag_wrapper_name option:selected'),
        b = addTag(),
        $a = $('div.this_search_on').next(),
        tag = {
            tid: a.attr('t_sid'),
            name: a.attr('t_name')
        },
        card = {
            cid: b,
            title: $a.find('h2').text(),
            url: $a.find('h2 > a').attr('href'),
            content: $a.find('p').text()
        },
        div = CheckIsTheSame( tag, card );
    if (div){
        $('#tag_container_CurrentTag').after(div);
		$.colorbox.close();
	}
}

function CheckIsTheSame( tag, card ){
	var $a = $('#tag_wrapper').find('div.post_url').children();
	for( var i = 0, len = $a.length; i < len; i++ ){
		if( $($a[i]).text().trim() == card.url.trim() ){
			var $b = $($a[i]).parents('div.tag');
			var a = $($b).attr('t_sid').split(' ');
			for( var j = 0, len = a.length; j < len; j++ ){
				if( a[j] == tag.tid ){
					alert('此標籤已用過了喔。');
					return '';
				}
			}
			var new_card = {
					cid: $($b).attr('sid'),
					title: card.title,
					url: card.url,
					content: card.content
				};
			return tagCardDivGen(tag, new_card);
		}
	}
	return tagCardDivGen(tag, card);
}

function workspace_AddToTag() { //確定加上 Tag： 打開工作空間時
    var a = $('#inline_AddToTag_wrapper_name option:selected'),
        b = addTag(),
        $a = $('div.this_workspace_on').next(),
        tag = {
            tid: a.attr('t_sid'),
            name: a.attr('t_name')
        },
        card = {
            cid: b,
            title: $a.find('h2').text(),
            url: $a.find('h2 > a').attr('href'),
            content: $a.find('p').text()
        },
        div = CheckIsTheSame( tag, card );
    if (div){
        $('#tag_container_CurrentTag').after(div);
		$.colorbox.close();
	}
}

function tag_AddToTag() { //確定加上 Tag： 打開我的標籤時
    var a = $('#inline_AddToTag_wrapper_name option:selected');
    var b = $('.this_tag_on').parent('div.tag_content').children('div.tag_content_color').length;
    var c = new Array();
    var c = $('.this_tag_on').parents('div.tag').attr('t_sid').split(' ');
    var d = $('.this_tag_on').parents('div.tag').attr('sid');
    //判斷 Tag 是否用過
    for (var i = 0; i < b; i++) {
        if (c[i] == a.attr('t_sid')) {
            var temp = 1; //temp == 1 -> Tag已用過
            break;
        } else {
            var temp = 0;
        }
    }
    if (temp == 0) { //判斷 Tag 是否使用過
        addTag();
        var $a = $('.this_tag_on').parents('div.tag');
        $('.this_tag_on').parents('div.tag')
            .attr('t_sid', $a.attr('t_sid') + ' ' + a.attr('t_sid'))
            .attr('t_name', $a.attr('t_name') + ' ' + a.attr('t_name'));
        $('.this_tag_on').prevAll('div.tag_content_tagname')
            .append('<span t_sid="' + a.attr('t_sid') + '">' + a.text() + '</span>')
            .end()
            .parent('div.tag_content').children('div.tag_content_color:last').after('<div class="tag_content_color">&nbsp;</div>');
        $.colorbox.close();
    } else {
        alert('Tag 重覆，請重選 Tag');
    }
}

function CheckColor(a) { //判斷是否 色調、濃度、亮度皆小於187
    var b = parseInt(a.substr(1, 2), 16);
    var c = parseInt(a.substr(3, 2), 16);
    var d = parseInt(a.substr(5, 2), 16);
    var e = 0;
    if (b > 187) e = 1;
    if (c > 187) e = 1;
    if (d > 187) e = 1;
    return e;
}

function show_tags_modifycard() { //顯示 card in my tags 介面
    if (window.matchMedia('(max-width:600px)').matches) { //手機
        var box_width = '95%';
        var box_height = '90%';
    } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
        var box_width = '80%';
        var box_height = '80%';
    } else { //電腦
        var box_width = '70%';
        var box_height = '70%';
    }
    $('div.tags_modifycard').colorbox({
        inline: true,
        fixed: true,
        width: box_width,
        height: box_height,
        reposition: true,
        transition: 'none',
        title: false,
        onComplete: function() {
            $('body').addClass('tags_modifycard_on');
            $('body').addClass('tag_box_on');
            $('#inline_tags_modifycard_wrapper_comment').val($('.show_tags_modifycard_ready').nextAll('div.tag_content_area').find('p').text());
            $('#inline_tags_modifycard_wrapper_name').val($('.show_tags_modifycard_ready').nextAll('div.tag_content_area').find('h2 > a').text());
            $('#inline_tags_modifycard_wrapper_url').val($('.show_tags_modifycard_ready').nextAll('div.tag_content_area').find('h2 > a').attr('href'));
        },
        onClosed: function() {
            $('div.tags_modifycard_on').removeClass('tags_modifycard_on');
            $('div.tag_box_on').removeClass('tag_box_on');
            $('.show_tags_modifycard_ready').removeClass('show_tags_modifycard_ready');
        }
    });
}

function tag_getTime() {
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

function edit_tag() { // 修改 Tag
    var name = $('#inline_ModifyTag_wrapper_name').val();
    var tid = $('#inline_all_tags .tag_modify_on').parents('.all_tags_inf').attr('tid');

    // 傳送資料
    $.post('db/t_set.php', {
        fbid: localStorage.FB_id,
        name: name,
        tid: tid
    })
        .fail(function(x) {
            console.log(x)
        })
        .done(function(r) {
            console.log(r)
        });

}

function colorSelect() {
    return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
}
// 新增 Tag

function newTag(t_sid) { // 新增 Tag

    // 參數
    var name = $('#inline_addtag_wrapper_name').val();
    var tid = 't' + createID();

    // 賦予 tid
    $('#inline_AddToTag_wrapper_name option[t_sid=' + t_sid + ']').attr('tid', tid);
    $('.all_tags_inf[t_sid=' + t_sid + ']').attr('tid', tid);

    // 傳送資料
    $.post('db/t_set.php', {
        fbid: localStorage.FB_id,
        name: name,
        tid: tid
    })
        .fail(function(x) {
            console.log(x)
        })
        .done(function(r) {
            console.log(r)
            $('#inline_addtag_wrapper_name').val('');
        });

}

// 刪除 Tag

function deleteTag(tid) {

    $.post('db/t_delete.php', {
        tid: tid
    })
        .fail(function(x) {
            console.log(x)
        })
        .done(function(r) {
            console.log(r)
        });

}

// 加上 Tag

function addTag() {

    // 參數
    var tid = $('#inline_AddToTag_wrapper_name option:selected').attr('tid');
    var cid = 'c' + createID();
    var pageInfo = JSON.parse(localStorage.page_info);

    // 傳送資料
    $.post('db/t_save.php', {
        tid: tid,
        cid: cid,
        title: pageInfo.title,
        content: pageInfo.content,
        url: pageInfo.url
    })
        .fail(function(x) {
            console.log(x)
        })
        .done(function(r) {
            console.log(r)
        });

    return cid;
}

// 刪除 Tag Card

function delete_card(that) {

    var t_sid = $(that).attr('t_sid');
    var tid = (t_sid.substr(0, 1) === 't') ? t_sid : $('.all_tags_inf[t_sid=' + t_sid + ']').attr('tid');
    var cid = $(that).parents('.tag').attr('sid');
    console.log(cid + ' to be deleted');

    $.post('db/t_delete.php', {
        tid: tid,
        cid: cid
    })
        .fail(function(x) {
            console.log(x)
        })
        .done(function(r) {
            console.log(r)
        });

}

// 取得 Tag 資料

function getTagData() {

    $.post('db/t_get.php', {
        fbid: localStorage.FB_id
    })
        .fail(function(x, s, e) {
            console.log(s + '(' + e + ')');
        })
        .done(function(r) {
            // data structure:
            // [ Object, Object, ... ]
            // Object : { tid: ..., name: ..., cards: Array }
            var data = JSON.parse(r), // 剖析資料
                div = '';
            if (data) {
                console.log("更新 tag 資料");
            } // console.log(data);

            data.forEach(function(tag) {
                var div = tagDivGen(tag);
                $('#inline_all_tags > div.all_tags_ShowAll').after(div);
                tag.cards.forEach(function(card) {
                    var div = tagCardDivGen(tag, card);
                    if (div)
                        $('#tag_container_CurrentTag').after(div);
                });
            });
        });
}

function tagDivGen(tag) {
    var div = '<div class="all_tags_inf" ' + 't_sid="' + tag.tid + '" tid="' + tag.tid + '" t_name="' + tag.name + '">' + '<div class="all_tags_inf_ModifyTag_area">' + '<a class="co_a all_tags_inf_ModifyTag" href="#inline_all_tags_inf_ModifyTag">&nbsp;</a>' + '</div>' + '<div class="all_tags_inf_icon"></div>' + '<div class="all_tags_inf_text">' + tag.name + '</div>' + '</div>'; // 產生 Tag DIV
    return div;
}

function tagCardDivGen(tag, card) {
    var tagCard = $('div.tag[sid=' + card.cid + ']')[0],
        div = '';
    if (tagCard) {
        // tag card 已存在
        var t_sid = tagCard.getAttribute('t_sid'),
            t_name = tagCard.getAttribute('t_name'),
            count = $(tagCard).find('div.tag_content_color').length +1;
        $(tagCard).attr('t_sid', t_sid + ' ' + tag.tid).attr('t_name', t_name + ' ' + tag.name);

        // 加 tag 到 tag card
        $(tagCard).find('div.tag_content_tagname').append(
            '<span t_sid="' + tag.tid + '">' + tag.name + '</span>'
        );
    } else {
        // 新 tag card
        div = '<div class="tag" ' + 't_sid="' + tag.tid + '" t_name="' + tag.name + '" sid="' + card.cid + '">' + '<div class="tag_content">' + '<div class="tag_content_tagname">' + '<span t_sid="' + tag.tid + '">' + tag.name + '</span>' + '</div>' + '<div class="tag_content_color">&nbsp;</div>' + '<div class="tag_content_selectarea" title="選擇">' + '<div class="tag_content_selectarea_icon"></div>' + '</div>' + '<div class="tag_content_inf"></div>' + '<div class="tag_content_inf_field">' + '<div class="tag_content_inf_field_content" title="群組共享" onclick="showWS()">' + '<div class="post_group">&nbsp;</div>' + '<div class="post_group_text">群組共享</div>' + '</div>' + '<div class="tag_content_inf_field_content" title="加上標籤">' + '<a class="co_a AddToTag" href="#inline_AddToTag" onclick="show_AddToTag()">&nbsp;</a>' + '<div class="post_tag">&nbsp;</div>' + '<div class="post_tag_text">加上標籤</div>' + '</div>' + '<div class="tag_content_inf_field_content" title="分享">' + '<div class="post_share">&nbsp;</div>' + '<div class="post_share_text">分享</div>' + '</div>' + '</div>' + '<div class="tag_content_area">' + '<div class="show_tag_content_area">' + '<h2 class="co_h2"><a class="co_a click_workspace_cards" href="' + card.url + '" target="_blank" onclick="show_cardcontain()">' + card.title + '</a></h2>' + '<p>' + card.content + '</p>' + '<div class="post_url">' + '<span>' + card.url + '</span>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>';

    }
    return div;
}
