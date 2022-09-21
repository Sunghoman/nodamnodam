function time2str(date) {
  let today = new Date();
  let time = (today - date) / 1000 / 60

  if (time < 60) {
    return parseInt(time) + '분 전'
  }
  time = time / 60
  if (time < 24) {
    return parseInt(time) + '시간 전'
  }
  time = time / 24
  if (time < 7) {
    return parseInt(time) + '일 전'
  }
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function num2str(count) {
  if (count > 10000) {
      return parseInt(count / 1000) + "k"
  }
  if (count > 500) {
      return parseInt(count / 100) / 10 + "k"
  }
  if (count == 0) {
      return ""
  }
  return count
}

function toggle_like(post_id, type) {
  console.log(post_id, type)
  let $a_like = $(`#${post_id} a[aria-label='heart']`)
  let $i_like = $a_like.find("i")
  if ($i_like.hasClass("fa-heart")) {
      $.ajax({
          type: "POST",
          url: "/update_like",
          data: {
              post_id_give: post_id,
              type_give: type,
              action_give: "unlike"
          },
          success: function (response) {
              console.log("unlike")
              $i_like.addClass("fa-heart-o").removeClass("fa-heart")
              $a_like.find("span.like-num").text(num2str(response["count"]))
          }
        })
  } else {
      $.ajax({
          type: "POST",
          url: "/update_like",
          data: {
              post_id_give: post_id,
              type_give: type,
              action_give: "like"
          },
          success: function (response) {
              console.log("like")
              $i_like.addClass("fa-heart").removeClass("fa-heart-o")
              $a_like.find("span.like-num").text(num2str(response["count"]))
          }
      })

    }
}
function post() {
  let comment = $("#textarea-post").val()
  let today = new Date().toISOString()
  $.ajax({
    type: "POST",
    url: "/posting",
    data: {
        comment_give: comment,
        date_give: today
    },
    success: function (response) {
        $("#modal-post").removeClass("is-active")
        window.location.reload()
    }
  })
}
function sign_out() {
  $.removeCookie('mytoken', {path: '/'});
  alert('로그아웃!')
  window.location.href = "/login"
}

function get_posts(username) {
  if (username == undefined) {
    username=''
  }
  $("#post-box").empty()
  $.ajax({
      type: "GET",
      url: `/get_posts?username_give=${username}`,
      data: {},
      success: function (response) {
          if (response["result"] == "success") {
              let posts = response["posts"]
              for (let i = 0; i < posts.length; i++) {
                  let post = posts[i]
                  let time_post = new Date(post["date"])
                  let time_before = time2str(time_post)
                  let class_heart = post["heart_by_me"] ? "fa-heart" : "fa-heart-o"
                  let count_heart = post["count_heart"]
                  let html_temp = `<div class="box" id="${post["_id"]}">
                                     <article class="media">
                                        <div class="media-left">
                                          <a class="image is-64x64" href="/user/${post['username']}">
                                            <img class="is-rounded" src="/static/${post['profile_pic_real']}" alt="Image">
                                          </a>
                                        </div>
                                        <div class="media-content">
                                            <div class="content">
                                              <p>
                                                <strong>${post['profile_name']}</strong> <small>@${post['username']}</small> <small>${time_before}</small>
                                                <br>
                                                ${post['comment']}
                                              </p>
                                            </div>
                                            <nav class="level is-mobile">
                                              <div class="level-left">
                                                <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post['_id']}', 'heart')">
                                                  <span class="icon is-small"><i class="fa ${class_heart}" aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(count_heart)}</span>
                                                </a>
                                              </div>
                                            </nav>
                                        </div>
                                     </article>
                                   </div>`
                  $("#post-box").append(html_temp)
              }
          }
      }
  })
}

// Calendar Start !!!
function calendarInit() {

  // 날짜 정보 가져오기
  var date = new Date(); // 현재 날짜(로컬 기준) 가져오기
  var utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000); // uct 표준시 도출
  var kstGap = 9 * 60 * 60 * 1000; // 한국 kst 기준시간 더하기
  var today = new Date(utc + kstGap); // 한국 시간으로 date 객체 만들기(오늘)

  var thisMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // 달력에서 표기하는 날짜 객체

  
  var currentYear = thisMonth.getFullYear(); // 달력에서 표기하는 연
  var currentMonth = thisMonth.getMonth(); // 달력에서 표기하는 월
  var currentDate = thisMonth.getDate(); // 달력에서 표기하는 일

  // kst 기준 현재시간
  // console.log(thisMonth);

  // 캘린더 렌더링
  renderCalender(thisMonth);

  function renderCalender(thisMonth) {

      // 렌더링을 위한 데이터 정리
      currentYear = thisMonth.getFullYear();
      currentMonth = thisMonth.getMonth();
      currentDate = thisMonth.getDate();

      // 이전 달의 마지막 날 날짜와 요일 구하기
      var startDay = new Date(currentYear, currentMonth, 0);
      var prevDate = startDay.getDate();
      var prevDay = startDay.getDay();

      // 이번 달의 마지막날 날짜와 요일 구하기
      var endDay = new Date(currentYear, currentMonth + 1, 0);
      var nextDate = endDay.getDate();
      var nextDay = endDay.getDay();

      // console.log(prevDate, prevDay, nextDate, nextDay);

      // 현재 월 표기
      $('.year-month').text(currentYear + '.' + (currentMonth + 1));

      // 렌더링 html 요소 생성
      calendar = document.querySelector('.dates')
      calendar.innerHTML = '';
      
      // 지난달
      for (var i = prevDate - prevDay + 1; i <= prevDate; i++) {
          calendar.innerHTML = calendar.innerHTML + '<div class="day prev disable">' + i + '</div>'
      }
      // 이번달
      for (var i = 1; i <= nextDate; i++) {
          calendar.innerHTML = calendar.innerHTML + '<a class="day current" id=' + currentYear + "-" + parseInt(currentMonth+1) + "-" + i +' onclick="clickFunc2(this.id)"><div>' + i + '</div></a>'
      }
      // 다음달
      for (var i = 1; i <= (7 - nextDay == 7 ? 0 : 7 - nextDay); i++) {
          calendar.innerHTML = calendar.innerHTML + '<div class="day next disable">' + i + '</div>'
      }

      // 오늘 날짜 표기
      if (today.getMonth() == currentMonth) {
          todayDate = today.getDate();
          var currentMonthDate = document.querySelectorAll('.dates .current');
          currentMonthDate[todayDate -1].classList.add('today');
      }
  }

  // 이전달로 이동
  $('.go-prev').on('click', function() {
      thisMonth = new Date(currentYear, currentMonth - 1, 1);
      renderCalender(thisMonth);
  });

  // 다음달로 이동
  $('.go-next').on('click', function() {
      thisMonth = new Date(currentYear, currentMonth + 1, 1);
      renderCalender(thisMonth); 
  });
}

