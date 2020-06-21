import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../posts.model';
import { PostService } from '../posts.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit{
  // posts = [
  //   {title: 'First post', content: 'This is the first post content'},
  //   {title: 'Second post', content: 'This is the second post content'},
  //   {title: 'Third post', content: 'This is the third post content'}
  // ];
  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public postService:PostService) {};

  ngOnInit() {
    this.postService.getPosts();
    this.postsSub = this.postService.getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  onDelete(id:string) {
    this.postService.deletePost(id);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
