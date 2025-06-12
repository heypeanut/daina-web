import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 生成页码按钮，带省略号
  const renderPageLinks = () => {
    if (isMobile) {
      // 首页、上一页、当前页、下一页、末页
      const items = [];
      // 首页
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            href={currentPage === 1 ? undefined : `?page=1`}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : 0}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      // 上一页
      items.push(
        <PaginationItem key="prev">
          <PaginationLink
            href={currentPage > 1 ? `?page=${currentPage - 1}` : undefined}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : 0}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          >
            &lt;
          </PaginationLink>
        </PaginationItem>
      );
      // 当前页
      items.push(
        <PaginationItem key={currentPage}>
          <PaginationLink isActive href={`?page=${currentPage}`}>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
      );
      // 下一页
      items.push(
        <PaginationItem key="next">
          <PaginationLink
            href={
              currentPage < totalPages ? `?page=${currentPage + 1}` : undefined
            }
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : 0}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          >
            &gt;
          </PaginationLink>
        </PaginationItem>
      );
      // 末页
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            href={
              currentPage === totalPages ? undefined : `?page=${totalPages}`
            }
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : 0}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
      return items;
    }
    // PC端原有逻辑
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={i === currentPage} href={`?page=${i}`}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // 头部2个，尾部2个，当前页前后各1个，超出用省略号
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(
            <PaginationItem key={i}>
              <PaginationLink isActive={i === currentPage} href={`?page=${i}`}>
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        pages.push(<PaginationEllipsis key="e1" />);
        pages.push(
          <PaginationItem key={totalPages}>
            <PaginationLink href={`?page=${totalPages}`}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (currentPage > totalPages - 4) {
        pages.push(
          <PaginationItem key={1}>
            <PaginationLink href={`?page=1`}>1</PaginationLink>
          </PaginationItem>
        );
        pages.push(<PaginationEllipsis key="e1" />);
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(
            <PaginationItem key={i}>
              <PaginationLink isActive={i === currentPage} href={`?page=${i}`}>
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      } else {
        pages.push(
          <PaginationItem key={1}>
            <PaginationLink href={`?page=1`}>1</PaginationLink>
          </PaginationItem>
        );
        pages.push(<PaginationEllipsis key="e1" />);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(
            <PaginationItem key={i}>
              <PaginationLink isActive={i === currentPage} href={`?page=${i}`}>
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        pages.push(<PaginationEllipsis key="e2" />);
        pages.push(
          <PaginationItem key={totalPages}>
            <PaginationLink href={`?page=${totalPages}`}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? `?page=${currentPage - 1}` : undefined}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : 0}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
        {renderPageLinks()}
        <PaginationItem>
          <PaginationNext
            href={
              currentPage < totalPages ? `?page=${currentPage + 1}` : undefined
            }
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : 0}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
