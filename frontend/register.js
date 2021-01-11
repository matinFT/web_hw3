url = "http://localhost:8080"



        get_all_posts()



        function get_all_posts() {
            fetch(url + "/api/post/").then(function (response) {
                response.text().then(function (res) {
                    posts = JSON.parse(res)["posts"]
                    replace_posts(posts)
                })
            })
                .catch(function (error) {
                    console.log("Error: " + error);
                })
        }

        function replace_posts(posts) {
            for (const post of posts) {
                var card_div = document.createElement('div');
                card_div.className = 'card';
                card_div.style.margin = '15px';
                var card_body_div = document.createElement('div');
                card_body_div.className = 'card-body';
                var card_title = document.createElement('h4');
                card_title.className = 'card-title';
                card_title.innerHTML = 'عنوان: ' + post['title'];
                var card_text1 = document.createElement('p');
                card_text1.className = 'card-text';
                card_text1.innerHTML = 'شناسه: ' + post['id'];
                var card_text2 = document.createElement('p');
                card_text2.className = 'card-text';
                card_text2.innerHTML = 'محتوا: ' + post['content'];
                var card_text3 = document.createElement('p');
                card_text3.className = 'card-text';
                card_text3.innerHTML = 'شناسه نویسنده: ' + post['created_by']
                var card_text4 = document.createElement('p');
                card_text4.className = 'card-text';
                card_text4.innerHTML = 'تاریخ ایجاد شدن: ' + post['created_at'];
                card_body_div.appendChild(card_title);
                card_body_div.appendChild(card_text1);
                card_body_div.appendChild(card_text2);
                card_body_div.appendChild(card_text3);
                card_body_div.appendChild(card_text4);
                card_div.appendChild(card_body_div);
                document.getElementsByClassName('all-posts')[0].appendChild(card_div);
            }
        }

        function register() {
            elem = document.getElementById("register-button");
            if (!elem.classList.contains("form-btn-active")) {
                elem.classList.toggle("form-btn-active");
                document.getElementById("enter-button").classList.toggle("form-btn-active");
                document.getElementById("register-form").style.display = "block";
                document.getElementById("enter-form").style.display = "none";
            }

        }

        function enter() {
            elem = document.getElementById("enter-button");
            if (!elem.classList.contains("form-btn-active")) {
                elem.classList.toggle("form-btn-active");
                document.getElementById("register-button").classList.toggle("form-btn-active");
                document.getElementById("register-form").style.display = "none";
                document.getElementById("enter-form").style.display = "block";
            }

        }

        function submit_register() {
            let register_form = document.forms["register-form"];
            if (!validate_register) {
                return
            }
            remove_error("register-error-message")

            data = `email=${register_form["email"].value}&password=${register_form["password"].value}`
            var request = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                body: data
            };
            fetch(url + "/api/signup", request).then(function (response) {
                stat = response.status
                if (stat == 201) {
                    location.replace(url)
                } else {
                    response.text().then(function (res) {
                        console.log(JSON.parse(res))
                    })
                }
            }).catch(function (error) {
                console.log("Error: " + error);
            })


        }

        function submit_enter() {
            if (!validate_enter) {
                return
            }
            remove_error("enter-error-message")
            var d = new Date();
            d.setTime(d.getTime() + (2 * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = "mycookie" + "=" + "cvalue" + "," + expires + ",path=/" + ", domain=127.0.0.1";

            let enter_form = document.forms["enter-form"];
            data = `email=${enter_form["email"].value}&password=${enter_form["password"].value}`
            var request = {
                credentials: "same-origin",
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                body: data
            };
            fetch(url + "/api/signin", request).then(function (response) {
                if (response.status == 200) {
                    location.replace(url)
                } else {
                    response.text().then(function (res) {
                        console.log(JSON.parse(res))
                    })
                }
            }).catch(function (error) {
                console.log("Error: " + error);
            })

        }

        function remove_error(form_id) {
            document.getElementById(form_id).style.opacity = 0
            document.getElementById(form_id).style.visibility = "hidden"
        }

        function ValidateEmail(mail) {
            if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
                return (true)
            }
            return (false)
        }

        function validate_register() {
            let register_form = document.forms["register-form"];
            if (!ValidateEmail(register_form["Email"].value)) {
                document.getElementById("register-error-text").innerText = "ایمیل نامعتبر"
                register_form["Email"].focus();
            }
            else if (register_form["Password"].value == '') {
                document.getElementById("register-error-text").innerText = "لطفا رمز عبور را وارد کنید"
                register_form["Password"].focus();
            }
            else if (register_form["Password"].value != register_form["RepeatePassword"].value) {
                document.getElementById("register-error-text").innerText = "عدم یکسان بودن رمزهای عبور"
                register_form["RepeatePassword"].focus();
            }
            else if (!register_form["terms-checkbox"].checked) {
                document.getElementById("register-error-text").innerText = "عدم قبول قوانین و شرایط"
                register_form["terms-checkbox"].focus();
            }
            else {
                return true
            }
            let error_element = document.getElementById("register-error-message");
            error_element.style.opacity = 1;
            error_element.style.visibility = "visible";
            return false
        }

        function validate_enter() {
            let enter_form = document.forms["enter-form"];
            if (!ValidateEmail(enter_form["email"].value)) {
                document.getElementById("enter-error-text").innerText = "ایمیل نامعتبر"
                enter_form["email"].focus();
            }
            else if (enter_form["password"].value == "") {
                document.getElementById("enter-error-text").innerText = "لطفا رمز عبور را وارد کنید"
                enter_form["password"].focus();
            }
            else {
                return true
            }
            let error_element = document.getElementById("enter-error-message");
            error_element.style.opacity = 1;
            error_element.style.visibility = "visible";
            return false
        }

