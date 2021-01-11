url = "http://localhost:8080"
		var post_under_edit = null
		var post_under_delete = null

		$(document).ready(function () {
			// Activate tooltip
			$('[data-toggle="tooltip"]').tooltip();

			// Select/Deselect checkboxes
			var checkbox = $('table tbody input[type="checkbox"]');
			$("#selectAll").click(function () {
				if (this.checked) {
					checkbox.each(function () {
						this.checked = true;
					});
				} else {
					checkbox.each(function () {
						this.checked = false;
					});
				}
			});
			checkbox.click(function () {
				if (!this.checked) {
					$("#selectAll").prop("checked", false);
				}
			});
		});


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
			main_header = document.getElementsByClassName('col-sm-6')[0];
			// main_header.innerHTML = `<h2><b>Posts</b> - User ID: 1234</h2>`
			tbody = document.getElementsByTagName('tbody')[0];
			for (i = 0; i < posts.length; i++) {
				tr = document.createElement('tr');
				td1 = document.createElement('td');
				td1.innerHTML = '<span class="custom-checkbox">' +
					`<input type="checkbox" id="checkbox${i + 1}" name="options[]" value="1">` +
					`<label for="checkbox${i + 1}"></label></span>`
				td2 = document.createElement('td');
				td2.innerHTML = posts[i]['id'];
				td3 = document.createElement('td');
				td3.innerHTML = posts[i]['title'];
				td4 = document.createElement('td');
				td4.innerHTML = posts[i]['content'];
				td5 = document.createElement('td');
				td5.innerHTML = posts[i]['created_by'];
				td6 = document.createElement('td');
				td6.innerHTML = posts[i]['created_at'];
				td7 = document.createElement('td');
				td7.innerHTML = '<a href="#editPostModal" class="edit" data-toggle="modal"' +
					'onclick="post_under_edit = this.parentElement.parentElement.childNodes[1].innerHTML"><i class="material-icons"' +
					'data-toggle="tooltip" title="Edit">&#xE254;</i></a>' +
					'<a href="#deletePostModal" class="delete" data-toggle="modal"' +
					'onclick = "post_under_delete = this.parentElement.parentElement.childNodes[1].innerHTML"><i`' +
					'class="material-icons" data-toggle="tooltip" title="Delete">❌</i></a>'
				tr.appendChild(td1);
				tr.appendChild(td2);
				tr.appendChild(td3);
				tr.appendChild(td4);
				tr.appendChild(td5);
				tr.appendChild(td6);
				tr.appendChild(td7);
				tbody.appendChild(tr);
			}

			// second_b_tag_of_hint_text_div = document.getElementsByClassName('hint-text')[0].children[1];
			// second_b_tag_of_hint_text_div.innerHTML = myJson.length;
		}

		function add_new_post() {
			new_post_form = document.forms["add_new_post_form"];
			data = `title=${new_post_form["title"].value}&content=${new_post_form["content"].value}`
			var request = {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				body: data
			};
			fetch(url + "/api/admin/post/crud", request).then(function (response) {
				stat = response.status
				if (stat == 201) {
					location.replace(url)
				} else {
					response.json().then(function (myj) { console.log(myj) })
				}

			}).catch(function (error) {
				console.log("Error: " + error);
			})
		}

		function update_post() {
			update_post_form = document.forms["update_post_form"];
			data = `title=${update_post_form["title"].value}&content=${update_post_form["content"].value}`
			var request = {
				method: 'PUT',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				body: data
			};
			console.log(url + `/api/admin/post/crud/${post_under_edit}`)
			fetch(url + "/api/admin/post/crud/" + post_under_edit, request).then(function (response) {
				stat = response.status
				if (stat == 204) {
					location.replace(url)
				} else {
					response.json().then(function (myj) { console.log(myj) })
				}
			}).catch(function (error) {
				console.log("Error: " + error);
			})
		}

		function delete_post() {
			var request = {
				method: 'DELETE'
			};
			console.log(url + `/api/admin/post/crud/${post_under_delete}`)
			fetch(url + `/api/admin/post/delete/${post_under_delete}`, request).then(function (response) {
				stat = response.status
				if (stat == 204) {
					location.replace(url)
				} else {
					response.json().then(function (myj) { console.log(myj) })
				}
			}).catch(function (error) {
				console.log("Error: " + error);
			})
		}

		function log_out() {
			var request = {
				method: 'POST'
			};
			fetch(url + "/logout", request).then(function (response) {
				location.replace(url)
			}).catch(function (error) {
				console.log("Error: " + error);
			})
		}