package com.tt.game;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

public class AniCfgGen {
	
	public static void main(String[] args) {
		String basePath = "/Users/small/WebstormProjects/Dev/myLdt/";
		String propPath = basePath + "cfg/AniProp.properties";
		String aniPath = basePath + "res/ani";
		String genPath = basePath + "cfg/AniCfg.js";
		AniCfgGen gen = new AniCfgGen(propPath, aniPath, genPath);
		gen.gen();
	}

	
	private static class AniCfgObj{
		public String plist = "";
		public List<String> frames = new ArrayList<String>();
		public String interval;
		public String name;
		public AniCfgObj(String name, String plist, String interval){
			this.name = name;
			this.plist = "Res." + plist;
			this.interval = interval;
		}
	}
	
	private List<AniCfgObj> list = new ArrayList<AniCfgObj>();
	
	private String propPath;
	private String aniPath;
	private String genPath;
	private Properties prop;
	private String defValue = "";
	
	public AniCfgGen(String propPath, String aniPath, String genPath){
		this.propPath = propPath;
		this.aniPath = aniPath;
		this.genPath = genPath;
	}
	
	public void gen(){
		System.out.println("|---------------------------------------|");
		System.out.println("|        AniCfgGen                      |");
		System.out.println("|        Author: Small                  |");
		System.out.println("|        Version: 1.0.0                 |");
		System.out.println("|---------------------------------------|");
		System.out.println("+++++++++++++gen Start+++++++++++++++++");
		this.prop = new Properties();
		InputStream in;
		try {
			in = new FileInputStream(this.propPath);
			prop.load(in);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		this.defValue = prop.getProperty("DEFAULT");
		parseDir(new File(this.aniPath));
		this.writeFile(this.genPath);
		System.out.println("+++++++++++++gen End+++++++++++++++++++");
	}
	
	public void parseDir(File file){
		if(file == null || file.isFile()) return;
		File[] files = file.listFiles();
		for(int i = 0; i < files.length; ++i){
			if(files[i].isDirectory()){
				this.parseDir(files[i]);
			}else if(files[i].isFile()){
				String name = files[i].getName();
				int index = name.lastIndexOf(".plist");
				if(index <= 0) continue;
				this.parse(files[i]);
			}
		}
	}
	
	private void parse(File file){
		SAXReader reader = new SAXReader();  
		String fileName = file.getName();
		String keyName = GameUtils.getKeyName(fileName);
		String interval = this.prop.getProperty(keyName);
		interval = interval == null || "new".equals(interval.toLowerCase()) ? this.defValue : interval;
		AniCfgObj obj = new AniCfgObj(keyName.substring(0, keyName.length() - 6), keyName, interval);
	    try{  
	        Document  doc = reader.read(file);  
	        List projects=doc.selectNodes("plist/dict/key");  
	        Iterator it=projects.iterator(); 
	        int index = 0;
	        while(it.hasNext()){  
	          Element elm=(Element)it.next(); 
	          if("frames".equals(elm.getStringValue().toLowerCase())) break;
	          index++;
	        }  
	        Element frameDict=(Element) doc.selectNodes("plist/dict/dict").get(index);
	        List frames = frameDict.elements("key");
	        for(int i = 0; i < frames.size(); ++i){
	        	Element el = (Element) frames.get(i);
	        	obj.frames.add(el.getStringValue());
	        }
	             
	    }  catch(Exception ex){  
	       ex.printStackTrace();  
	    } 
	    list.add(obj);
	}

	public void writeFile(String file){
		FileOutputStream out = null;
		try{
            out=new FileOutputStream(file);
            PrintWriter ps = new PrintWriter(new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), "UTF-8")));
            ps.println("var AniCfg = {");
    		for(int i = 0; i < list.size(); ++i){
    			AniCfgObj obj = list.get(i);
    			StringBuffer sb = new StringBuffer();
    			sb.append("        ").append(obj.name).append(" : {");
    			ps.println(sb);
    			sb = new StringBuffer();
    			sb.append("        plist : ").append(obj.plist).append(",");
    			ps.println(sb);
    			sb = new StringBuffer();
    			sb.append("        interval : ").append(obj.interval).append(",");
    			ps.println(sb);
    			sb = new StringBuffer();
    			ps.println("        frames : [");
    			List<String> frames = obj.frames;
    			for(int j = 0; j < frames.size(); ++j){
        			sb = new StringBuffer();
        			sb.append("            '").append(frames.get(j)).append("'");
        			if(j < frames.size() - 1) sb.append(",");
        			ps.println(sb);
    			}
    			ps.println("        ]");
    			if(i < list.size() - 1) ps.println("    },");
    			else ps.println("    }");
    		}
            ps.println("};");
    		ps.close();
        } catch (FileNotFoundException e){
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} finally{
    		if(out != null)
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
        }
	}
	
}
