export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-navy-900 via-primary-900 to-navy-900 text-white py-8 px-4 mt-auto">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-2 text-silver-200">Contact</h3>
            <p className="text-silver-400 text-sm">
              Abrazo West Campus<br />
              Level 1 Trauma Center
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-silver-200">Quick Access</h3>
            <p className="text-silver-400 text-sm">
              24/7 Resource Portal<br />
              Medical Staff Only
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-silver-200">Support</h3>
            <p className="text-silver-400 text-sm">
              For technical assistance<br />
              Contact IT Department
            </p>
          </div>
        </div>
        <div className="border-t border-silver-700/30 pt-6 text-center">
          <p className="text-silver-500 text-sm">
            &copy; {new Date().getFullYear()} Abrazo West Campus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}