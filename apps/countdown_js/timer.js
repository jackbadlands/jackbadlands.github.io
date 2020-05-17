function set_cb (id, cb) {
  let obj = document.getElementById(id);
  obj.onclick = cb;
}

function get_time () {
  let secs = (new Date()).getTime() / 1000;
  return secs;
}

var target_time = 0;
var interval_obj = null;
var saved_hms = [];

function set_input_val (id, val) {
  let obj = document.getElementById(id);
  obj.value = val;
}

function set_inner (id, val) {
  let obj = document.getElementById(id);
  obj.innerHTML = val;
}

function get_input_val (id) {
  let obj = document.getElementById(id);
  return obj.value;
}

function get_input_num_val (id) {
  return Number(get_input_val(id));
}

function save_hms () {
  saved_hms[0] = get_input_val("hours");
  saved_hms[1] = get_input_val("mins");
  saved_hms[2] = get_input_val("secs");
}

function restore_hms () {
  set_input_val("hours", saved_hms[0]);
  set_input_val("mins", saved_hms[1]);
  set_input_val("secs", saved_hms[2]);
}

function update_time_view (cur, trg) {
  let dt = trg - cur;
  if (dt < 0) {
    dt = 0;
  }
  let s = Math.floor(dt % 60);
  dt /= 60;
  let m = Math.floor(dt % 60);
  dt /= 60;
  let h = Math.floor(dt);
  set_input_val("hours", h + "");
  set_input_val("mins", m + "");
  set_input_val("secs", s + "");
}

function check_running_time () {
  let cur_time = get_time();
  update_time_view(cur_time, target_time);
  if (cur_time >= target_time) {
    pause_timer();
    restore_hms();
    ring();
  }
}

function set_timer (h, m, s) {
  set_input_val("hours", h + "");
  set_input_val("mins", m + "");
  set_input_val("secs", s + "");
}

var DEFAULT_TIME = 60 * 5;

function on_page_close () {
  if (interval_obj != null) {
    return true;
  }
  return null;
}

function start_timer () {
  let cur_time = get_time();
  save_hms();
  let h = get_input_num_val("hours") || 0;
  let m = get_input_num_val("mins") || 0;
  let s = get_input_num_val("secs") || 0;
  let incr_time = h * 60 * 60 + m * 60 + s;
  if (incr_time == 0) {
    incr_time = DEFAULT_TIME;
  }
  target_time = cur_time + incr_time;
  interval_obj = setInterval(check_running_time, 150);
  set_inner("tstart", "пауза");
  set_cb("tstart", pause_timer);
}

function pause_timer () {
  if (interval_obj != null) {
    clearInterval(interval_obj);
    interval_obj = null;
  }
  set_inner("tstart", "старт");
  set_cb("tstart", start_timer);
}

function ring () {
  let snd_obj = new Audio('ring.mp3');
  snd_obj.loop = true;
  snd_obj.play();
  console.log("ring started");
  alert("звонок");
  snd_obj.pause();
  console.log("ring stopped");
}

function timer_init () {
  set_cb("tstart", start_timer);
  set_cb("ttring", ring);
}

window.onbeforeunload = on_page_close;
window.onunload = on_page_close;
