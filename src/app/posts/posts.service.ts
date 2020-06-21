import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http"
import { Post } from './posts.model';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(
    private http: HttpClient
  ) {}

  getPosts() {
    this.http.get<{message:string, posts:any}>('http://localhost:3000/api/posts')
      .pipe(map((data) => {
        return data.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        });
      }))
      .subscribe((posts) => {
        this.posts = posts;
        console.log(this.posts);
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title:string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message:string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((res) => {
        const id = res.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(id:string) {
    this.http.delete(`http://localhost:3000/api/posts/${id}`)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== id);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      })
  }
}
