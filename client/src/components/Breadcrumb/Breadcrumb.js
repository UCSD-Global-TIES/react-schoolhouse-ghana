import React from 'react';

const Breadcrumb = ({ link }) => {
  const breadcrumbItems = link?.split('/').filter(item => item !== '') || [];

  return (
    <div style={{ width: '100%', height: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'inline-flex' }}>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          <div
            style={{
              color: '#4B4B4B',
              fontSize: 28,
              fontFamily: 'Asap Condensed',
              fontWeight: index === breadcrumbItems.length - 1 ? '700' : '400',
              textDecoration: index === breadcrumbItems.length - 1 ? 'underline' : 'none',
              wordWrap: 'break-word'
            }}
          >
            {item}
          </div>
          {index !== breadcrumbItems.length - 1 && <div style={{ color: '#4B4B4B', fontSize: 28, fontFamily: 'Asap Condensed', fontWeight: '400', wordWrap: 'break-word' }}>/</div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;