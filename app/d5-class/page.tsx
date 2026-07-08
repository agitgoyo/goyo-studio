/* eslint-disable @next/next/no-img-element */

const DETAIL_IMAGE_COUNT = 14;

const detailImages = Array.from({ length: DETAIL_IMAGE_COUNT }, (_, index) => {
  const pageNumber = String(index + 1).padStart(2, "0");

  return {
    src: `/class-detail/page-${pageNumber}.jpg`,
    alt: `고요클래스 상세 이미지 ${index + 1}`,
  };
});

export default function D5ClassPage() {
  return (
    <main className="d5-detail-page">
      <div className="d5-detail-gallery">
        {detailImages.map((image) => (
          <section key={image.src} className="d5-detail-frame">
            <img src={image.src} alt={image.alt} className="d5-detail-image" loading="lazy" />
          </section>
        ))}
      </div>

      <section className="d5-detail-admin">
        <a href="/admin" className="d5-detail-button d5-detail-button-secondary">
          관리자 페이지
        </a>
      </section>

      <a href="/apply" className="d5-detail-floating-apply">
        신청하기
      </a>
    </main>
  );
}
