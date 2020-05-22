// @flow
import React, { Component } from "react";

import "./styles.scss";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

export type PaginationType = {
  items: number,
  currentPage: number,
  pages: number,
  pageSize: number
} | null;

type PaginationProps = {
  pageLimit?: number,
  pageNeighbours: number,
  totalPages: number,
  currentPage: number,

  onPageChanged?: Function
};

type PaginationState = {
  currentPage: number
};

class Pagination extends Component<PaginationProps, PaginationState> {
  constructor(props: PaginationProps) {
    super(props);
    this.state = {
      currentPage: Math.max(1, Math.min(props.currentPage, props.totalPages))
    };
  }

  static defaultProps = {
    pageNeighbours: 1,
    activePage: 1,
    totalPages: 0
  };

  gotoPage = (page: number) => {
    const { onPageChanged = f => f } = this.props;

    const currentPage = Math.max(0, Math.min(page, this.props.totalPages));

    this.setState({ currentPage }, () => onPageChanged({ page: currentPage }));
  };

  handleClick = (page: number) => {
    this.gotoPage(page);
  };

  gotoPrevPage = () => {
    this.gotoPage(this.state.currentPage - 1);
  };

  gotoNextPage = () => {
    this.gotoPage(this.state.currentPage + 1);
  };

  fetchPageNumbers = () => {
    const totalPages = this.props.totalPages;
    const currentPage = this.state.currentPage;
    const pageNeighbours = this.props.pageNeighbours;

    const totalNumbers = this.props.pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      let pages = [];

      const leftBound = currentPage - pageNeighbours;
      const rightBound = currentPage + pageNeighbours;
      const beforeLastPage = totalPages - 1;

      const startPage = leftBound > 2 ? leftBound : 2;
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

      pages = range(startPage, endPage);

      const pagesCount = pages.length;
      const singleSpillOffset = totalNumbers - pagesCount - 1;

      const leftSpill = startPage > 2;
      const rightSpill = endPage < beforeLastPage;

      const leftSpillPage = LEFT_PAGE;
      const rightSpillPage = RIGHT_PAGE;

      if (leftSpill && !rightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [leftSpillPage, ...extraPages, ...pages];
      } else if (!leftSpill && rightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, rightSpillPage];
      } else if (leftSpill && rightSpill) {
        pages = [leftSpillPage, ...pages, rightSpillPage];
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };
  render() {
    const { totalPages } = this.props;
    if (totalPages === 0) return null;

    const { currentPage } = this.state;
    const pages = this.fetchPageNumbers();
    return (
      <nav className="pagination-block">
        <button
          disabled={currentPage === 1}
          className="navigation-button"
          onClick={this.gotoPrevPage}
        >
          Prev Page
        </button>
        <ul className="pagination">
          {pages.map((page, index) => {
            if (page === LEFT_PAGE)
              return (
                <li key={index} className="page-item">
                  ...
                </li>
              );

            if (page === RIGHT_PAGE)
              return (
                <li key={index} className="page-item separator">
                  ...
                </li>
              );

            return (
              <li
                key={index}
                className={`page-item${currentPage === page ? " active" : ""}`}
              >
                <button
                  className="page-link"
                  // $FlowFixMe
                  onClick={() => this.handleClick(page)}
                >
                  {page}
                </button>
              </li>
            );
          })}
        </ul>
        <button
          disabled={currentPage === this.props.totalPages}
          className="navigation-button"
          onClick={this.gotoNextPage}
        >
          Next Page
        </button>
      </nav>
    );
  }
}

export default Pagination;
