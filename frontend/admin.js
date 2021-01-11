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

// var pathname = window.location.pathname;
// const user_id = pathname.substring(pathname.lastIndexOf('/') + 1);
user_id = 1;
url = 'http://localhost:8080/api/admin/post/crud/';

fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (myJson) {

    })
    .catch(function (error) {
        console.log("Error: " + error);
        myJson = '';
        post_id = 1;
        if (post_id) {
            myJson = {
                'post': {
                    "id": 1,
                    "title": "Post Title",
                    "content": "Post Content",
                    "created_by": 1,
                    "created_at": "2020/12/19"
                }
            }

            myJson = [myJson['post']];

        } else {
            myJson = {
                "posts": [
                    {
                        "id": 1,
                        "title": "Post Title",
                        "content": "Post Content",
                        "created_by": 1,
                        "created_at": "2020/12/19"
                    },
                    {
                        "id": 2,
                        "title": "Post2 Title",
                        "content": "Post2 Content",
                        "created_by": 2,
                        "created_at": "2020/12/19"
                    },
                    {
                        "id": 3,
                        "title": "Post Title",
                        "content": "Post Content",
                        "created_by": 1,
                        "created_at": "2020/12/19"
                    },
                    {
                        "id": 4,
                        "title": "Post2 Title",
                        "content": "Post2 Content",
                        "created_by": 2,
                        "created_at": "2020/12/19"
                    },
                    {
                        "id": 5,
                        "title": "Post Title",
                        "content": "Post Content",
                        "created_by": 1,
                        "created_at": "2020/12/19"
                    },
                    {
                        "id": 6,
                        "title": "Post2 Title",
                        "content": "Post2 Content",
                        "created_by": 2,
                        "created_at": "2020/12/19"
                    },
                    {
                        "id": 7,
                        "title": "Post Title",
                        "content": "Post Content",
                        "created_by": 1,
                        "created_at": "2020/12/19"
                    },
                    {
                        "id": 8,
                        "title": "Post2 Title",
                        "content": "Post2 Content",
                        "created_by": 2,
                        "created_at": "2020/12/19"
                    }
                ]
            }

            myJson = myJson['posts'];
        }
        main_header = document.getElementsByClassName('col-sm-6')[0];
        main_header.innerHTML = `<h2>User ID: ${user_id}</h2>`
        tbody = document.getElementsByTagName('tbody')[0];
        for (i = 0; i < myJson.length; i++) {
            tr = document.createElement('tr');
            td1 = document.createElement('td');
            td1.innerHTML = '<span class="custom-checkbox">' +
                `<input type="checkbox" id="checkbox${i + 1}" name="options[]" value="1">` +
                `<label for="checkbox${i + 1}"></label></span>`
            td2 = document.createElement('td');
            td2.innerHTML = myJson[i]['id'];
            td3 = document.createElement('td');
            td3.innerHTML = myJson[i]['title'];
            td4 = document.createElement('td');
            td4.innerHTML = myJson[i]['content'];
            td5 = document.createElement('td');
            td5.innerHTML = myJson[i]['created_by'];
            td6 = document.createElement('td');
            td6.innerHTML = myJson[i]['created_at'];
            td7 = document.createElement('td');
            td7.innerHTML = '<a href="#editPostModal" class="edit" data-toggle="modal"><i class="material-icons"' +
                'data-toggle="tooltip" title="Edit">&#xE254;</i></a>' +
                `<a href="#deletePostModal" class="delete" data-toggle="modal"><i` +
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
    });