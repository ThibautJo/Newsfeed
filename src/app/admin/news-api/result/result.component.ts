import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { newsApiArticle } from 'src/app/interfaces/newsApiArticle';
import { MatTable, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AdminService } from '../../admin.service';


@Component({
  selector: 'app-admin-newsApi-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  constructor(private adminService: AdminService) { }

  @Input() set articles(value: newsApiArticle[]) {
    this._articles = value;

    if (this._articles != null) {
      this.renderTable();
    }
  }

  get articles(): newsApiArticle[] {
    return this._articles;
  }

  @ViewChild('mytable', { static: true }) table: MatTable<any>;
  private _articles: newsApiArticle[];
  
  displayedColumns: string[] = ['select', 'title', 'description', 'author', 'publishedAt'];
  dataSource = new MatTableDataSource<newsApiArticle>([]);
  selection = new SelectionModel<newsApiArticle>(true, []);

  ngOnInit() {
  }

  // Runs when this.articles data has been loaded
  renderTable() {
    this.articles.map(
      (article: newsApiArticle) => {
        if (article.description == null || article.description == undefined) {
          article.description = 'No description...';
        }
        article.publishedAt = article.publishedAt.split('T')[0];
      });

    // re-initialize because data has now loaded;
    this.dataSource = new MatTableDataSource<newsApiArticle>(this.articles);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: newsApiArticle): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.author}`;
  }

  deleteSelection() {

    this.removeFromDataSource();
    this.table.renderRows();
  }

  addSelectionToDatabase() {
    this.adminService.PostArticlesToDatabase(this.selection.selected).subscribe(
      result => {
        alert(result);
        this.removeFromDataSource();
      }
    );
  }

  private removeFromDataSource(){
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row)) {

        this.dataSource.data = this.dataSource.data.filter((value,index) => {
          return value.title != row.title;
        });

        this.selection.deselect(row);
      }
    });
  }
}
