import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import{BsFacebook, BsGithub, BsInstagram, BsLinkedin, BsTwitter} from 'react-icons/bs'


export default function FooterComponent() {
  return (
    <Footer container className='border-t-8 border-teal-500'>
        <div className="w-full max-w-7xl mx-auto">
            <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                <div className="mt-5">
                    <Link to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white' >
                    <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                    Omar's</span>
                        Blog
                    </Link>
                </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        <div className="">
                            <Footer.Title title='ABOUT'/>
                            <Footer.LinkGroup col>
                                <Footer.Link href='https://www.100jsprojects.com' target='blank' rel='noopener noreferrer'>
                                    100 JS Projects
                                </Footer.Link>
                                <Footer.Link href='/about' target='blank' rel='noopener noreferrer'>
                                    Omar's Blog
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div className="">
                            <Footer.Title title='FOLLOW US'/>
                            <Footer.LinkGroup col>
                                <Footer.Link href='https://github.com/omarzorgati' target='blank' rel='noopener noreferrer'>
                                    Github
                                </Footer.Link>
                                <Footer.Link href='#'>
                                    Discord
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div className="">
                            <Footer.Title title='legal'/>
                            <Footer.LinkGroup col>
                                <Footer.Link href='#'>
                                    Privacy Policy
                                </Footer.Link>
                                <Footer.Link href='#'>
                                    Terms and Condition
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
            </div>
            <Footer.Divider/>
            <div className="w-full sm:flex sm:items-center sm:justify-between">
                <Footer.Copyright href='#' by="Omar's Blog" year={new Date().getFullYear()} />
                <div className="flex gap-4 sm:mt-0 mt-4 sm:justify-center">
                    <Footer.Icon href='#' icon={BsFacebook} />
                    <Footer.Icon href='#' icon={BsInstagram} />
                    <Footer.Icon href='#' icon={BsTwitter} />
                    <Footer.Icon href='#' icon={BsLinkedin} />
                    <Footer.Icon href='https://github.com/omarzorgati' icon={BsGithub} />
                </div>
            </div>
        </div>
    </Footer>
    )
}
