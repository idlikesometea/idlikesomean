import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http"
import { Router } from '@angular/router';

import { Post } from './posts.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/posts";

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], total:number}>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getPosts(postPerPage:number, currentPage:number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http.get<{message:string, posts:any, total:number}>(`${BACKEND_URL}/${queryParams}`)
      .pipe(map((data) => {
        return { posts: data.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          }
        }),
        total: data.total }
      })
    )
      .subscribe((postsData) => {
        this.posts = postsData.posts;
        this.postsUpdated.next({posts:[...this.posts], total:postsData.total});
      });
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_id:string, title: string, content:string, imagePath:string, creator:string}>(`${BACKEND_URL}/${id}`);
  }

  addPost(title:string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http.post<{message:string, post: Post}>(BACKEND_URL, postData)
      .subscribe((res) => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(id:string) {
    return this.http.delete(`${BACKEND_URL}/${id}`);
  }

  updatePost(id:string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put(`${BACKEND_URL}/${id}`, postData)
      .subscribe(result => {
        this.router.navigate(["/"]);
      })
  }
}
