import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../posts.model';
import { PostService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit{
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizes = [1, 2, 5, 10];
  authed: boolean = false;
  userId: string;
  authListener: Subscription;
  constructor(public postService:PostService, private authService: AuthService) {};

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.postsSub = this.postService.getPostsUpdateListener()
    .subscribe((postsData: {posts: Post[], total: number}) => {
      this.isLoading = false;
      this.posts = postsData.posts;
      this.totalPosts = postsData.total;
    });

    this.authed = this.authService.isAuthed();
    this.userId = this.authService.getUserId();
    this.authListener = this.authService.getAuthStatus()
      .subscribe(authed => {
        this.authed = authed;
        this.userId = this.authService.getUserId();
      })
  }

  onDelete(id:string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.postPerPage, this.currentPage);
    }, err => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authListener.unsubscribe();
  }
}
