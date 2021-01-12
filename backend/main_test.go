package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"
)

// func TestSignUp(t *testing.T) {
// 	router := handler()
// 	data := url.Values{}
// 	data.Set("email", "majidhastam@gmail.com")
// 	data.Set("password", "basdfaz")
// 	w := httptest.NewRecorder()
// 	req, _ := http.NewRequest("POST", "/api/signup", strings.NewReader(data.Encode()))
// 	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
// 	router.ServeHTTP(w, req)
// 	fmt.Println(w.Code)
// 	if w.Code != 201 {
// 		t.Fail()
// 	}
// }

// func TestSignIn(t *testing.T) {
// 	router := handler()
// 	data := url.Values{}
// 	data.Set("email", "majidhastam@gmail.com")
// 	data.Set("password", "basdfaz")
// 	w := httptest.NewRecorder()
// 	req, _ := http.NewRequest("POST", "/api/signin", strings.NewReader(data.Encode()))
// 	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
// 	router.ServeHTTP(w, req)
// 	fmt.Println(w.Code)
// 	fmt.Println(w.Body.String())
// 	if w.Code != 200 {
// 		t.Fail()
// 	}
// }

func TestCreatPost(t *testing.T) {
	router := handler()
	data := url.Values{}
	data.Set("title", "p.title1")
	data.Set("content", "p.content1")
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/admin/post/crud", strings.NewReader(data.Encode()))
	token := "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZHNkYUBnbWFpbC5jb20iLCJleHAiOjE2MTA0ODc3Nzl9.48_o4tl5GZPfHNVvwAJJ4eow2K7IrLwTJgONcbwrjXs"
	req.Header.Add("Authorization", token)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	router.ServeHTTP(w, req)
	fmt.Println(w.Code)
	fmt.Println(w.Body.String())
	if w.Code != 201 {
		t.Fail()
	}
}
