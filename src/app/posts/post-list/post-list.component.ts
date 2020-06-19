import { Component } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {
  posts = [
    {title: 'First post', content: 'This is the first post content'},
    {title: 'Second post', content: 'This is the second post content'},
    {title: 'Third post', content: 'This is the third post content'}
  ];
}
