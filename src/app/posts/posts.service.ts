import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http"
import { Post } from './posts.model';
import { Router } from '@angular/router';

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
    this.http.get<{message:string, posts:any, total:number}>(`http://localhost:3000/api/posts${queryParams}`)
      .pipe(map((data) => {
        return { posts: data.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
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
    return this.http.get<{_id:string, title: string, content:string, imagePath:string}>(`http://localhost:3000/api/posts/${id}`);
  }

  addPost(title:string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http.post<{message:string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe((res) => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(id:string) {
    return this.http.delete(`http://localhost:3000/api/posts/${id}`);
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
        imagePath: image
      };
    }
    this.http.put(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe(result => {
        this.router.navigate(["/"]);
      })
  }
}
