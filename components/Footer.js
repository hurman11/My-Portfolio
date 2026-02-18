import Link from 'next/link';

export default function Footer() {
    return (
        <footer>
            <div className="footer-inner">
                <div className="footer-profile">
                    <div className="profile-pic"></div>
                    <p>
                        I&rsquo;m Hurman, a cybersecurity student
                        <br />
                        based in Pakistan.
                    </p>
                </div>
                <div className="footer-cta">
                    <Link href="/contact">Let&rsquo;s Talk &rarr;</Link>
                </div>
            </div>
            <div className="footer-bottom">
                <span>&copy; 2026 Hurman. All rights reserved.</span>
                <div className="footer-links">
                    <a href="#" target="_blank" rel="noopener">
                        LinkedIn
                    </a>
                    <a href="#" target="_blank" rel="noopener">
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
}
