from langchain_google_genai import GoogleGenerativeAIEmbeddings, GoogleGenerativeAI
from langchain.vectorstores import Chroma
from langchain.document_loaders import TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from dotenv import load_dotenv
import os

load_dotenv()
GOOGLE_API_KEY = os.getenv("AIzaSyCU9mfpe7IIrRytl6Pi1Bm3i8b0pFSRzZ8")

loader = TextLoader("data/knowledge.txt")
pdf_loader = PyPDFLoader("data/knowledge.pdf")
docs = loader.load()
pdf_docs = pdf_loader.load()
all_docs = docs + pdf_docs

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
split_docs = splitter.split_documents(all_docs)
print(f"✅ Total chunks loaded: {len(split_docs)}")

embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key="AIzaSyCU9mfpe7IIrRytl6Pi1Bm3i8b0pFSRzZ8")
vectorstore = Chroma.from_documents(split_docs, embedding=embedding)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True, output_key="answer")
llm = GoogleGenerativeAI(model="models/gemini-1.5-flash", google_api_key="AIzaSyCU9mfpe7IIrRytl6Pi1Bm3i8b0pFSRzZ8")


qa_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    memory=memory,
    return_source_documents=True,
    output_key="answer",
)