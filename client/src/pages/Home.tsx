import { Link } from "wouter";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Swipe Right for Your Dream Job</h1>
              <p className="text-xl mb-8">Find your perfect professional match. JobSwipe connects job seekers with opportunities through an easy, intuitive interface.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/swipe">
                  <a className="bg-white hover:bg-neutral-100 text-primary font-semibold px-6 py-3 rounded-full inline-block text-center">
                    Get Started
                  </a>
                </Link>
                <button className="bg-transparent hover:bg-white/10 text-white border border-white font-semibold px-6 py-3 rounded-full">
                  For Recruiters
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="rounded-lg shadow-xl overflow-hidden max-w-full">
                <img 
                  src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=500&q=80" 
                  alt="Person using JobSwipe" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">How JobSwipe Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-100 rounded-lg p-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-edit text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
              <p className="text-neutral-500">Set up your professional profile and upload your resume to showcase your skills and experience.</p>
            </div>
            
            <div className="bg-neutral-100 rounded-lg p-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-hand-pointer text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Swipe on Jobs</h3>
              <p className="text-neutral-500">Swipe right on positions you're interested in and left on those that don't match your preferences.</p>
            </div>
            
            <div className="bg-neutral-100 rounded-lg p-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-comments text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect with Recruiters</h3>
              <p className="text-neutral-500">When there's mutual interest, you'll match with recruiters and can begin the conversation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&h=80&q=80" 
                    alt="User testimonial" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-neutral-500 text-sm">Software Developer</p>
                </div>
              </div>
              <p className="text-neutral-600">"I found my dream job at a tech startup within a week of using JobSwipe. The interface made it so easy to browse opportunities that matched my skills."</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&h=80&q=80" 
                    alt="User testimonial" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Michael Rodriguez</h4>
                  <p className="text-neutral-500 text-sm">Marketing Specialist</p>
                </div>
              </div>
              <p className="text-neutral-600">"The matching algorithm is incredible. I was connected with companies that perfectly aligned with my career goals and values. Highly recommend!"</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-secondary text-black">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Job Match?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of professionals who have already found their dream positions through JobSwipe.</p>
          <Link href="/profile">
            <a className="bg-white hover:bg-neutral-100 text-secondary font-semibold px-8 py-4 rounded-full text-lg inline-block">
              Create Your Profile
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
